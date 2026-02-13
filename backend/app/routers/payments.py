from fastapi import APIRouter, HTTPException, Request, Header
from fastapi import Depends
from sqlalchemy.orm import Session
import os
import json
import hmac
import hashlib

try:
    import stripe
except Exception:
    stripe = None

from ..deps import get_db
from ..services.itinerary_generator import generate_itinerary
from .. import schemas, models

router = APIRouter(prefix="/api/payments", tags=["payments"])

STRIPE_SECRET = os.environ.get("STRIPE_SECRET_KEY", "sk_test_replace_me")
# dev frontend default: Vite started on 5175 in this workspace
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5175")
RAZORPAY_KEY = os.environ.get("RAZORPAY_KEY")
RAZORPAY_SECRET = os.environ.get("RAZORPAY_SECRET")
RAZORPAY_WEBHOOK_SECRET = os.environ.get("RAZORPAY_WEBHOOK_SECRET")

if stripe is not None:
    stripe.api_key = STRIPE_SECRET

# In-memory dev sessions when Stripe is not configured (local testing)
DEV_SESSIONS = {}

@router.post("/create-checkout-session")
async def create_checkout_session(req: Request):
    body = await req.json()
    # expected: { payload: {...}, amount: number }
    payload = body.get("payload")
    amount = int(body.get("amount", 0))
    if not payload or amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid payload or amount")

    # If Stripe key is not configured, create a dev session so frontend popup can be tested locally
    if not STRIPE_SECRET or "replace_me" in STRIPE_SECRET:
        import uuid
        dev_id = f"dev_{uuid.uuid4().hex}"
        DEV_SESSIONS[dev_id] = {"payload": payload, "amount": amount}
        # point to frontend's checkout-success which will call /api/payments/confirm
        return {"url": f"{FRONTEND_URL}/checkout-success?session_id={dev_id}", "id": dev_id}

    # store payload in metadata as JSON string (max metadata size applies)
    try:
        metadata = {"payload": json.dumps(payload)}
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "inr",
                        "product_data": {"name": f"YatraGenie itinerary for {payload.get('destination_city_name','trip')}"},
                        "unit_amount": amount * 100,
                    },
                    "quantity": 1,
                }
            ],
            metadata=metadata,
            success_url=f"{FRONTEND_URL}/checkout-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/",
        )
        return {"url": session.url, "id": session.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/create-razorpay-order")
async def create_razorpay_order(req: Request):
    body = await req.json()
    payload = body.get("payload")
    amount = int(body.get("amount", 0))
    method = body.get("method", "card")
    if not payload or amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid payload or amount")

    # Dev fallback when keys aren't set
    if not RAZORPAY_KEY or not RAZORPAY_SECRET:
        import uuid
        dev_order = f"dev_order_{uuid.uuid4().hex}"
        # store in DEV_SESSIONS for later confirmation
        DEV_SESSIONS[dev_order] = {"payload": payload, "amount": amount, "method": method}
        return {"dev": True, "order_id": dev_order, "key": "rzp_test_dev"}

    # create order via Razorpay REST API
    try:
        import requests
        order_payload = {
            "amount": amount * 100,
            "currency": "INR",
            "receipt": f"yg_receipt_{payload.get('destination_city_name','trip')}",
            "payment_capture": 1,
        }
        resp = requests.post(
            "https://api.razorpay.com/v1/orders",
            auth=(RAZORPAY_KEY, RAZORPAY_SECRET),
            json=order_payload,
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        return {"dev": False, "order_id": data["id"], "key": RAZORPAY_KEY, "order": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/confirm-razorpay")
async def confirm_razorpay(req: Request, db: Session = Depends(get_db)):
    body = await req.json()
    order_id = body.get("order_id")
    payment_id = body.get("payment_id")
    payload = body.get("payload")
    if not order_id or not payment_id or not payload:
        raise HTTPException(status_code=400, detail="Missing order_id/payment_id/payload")

    # Dev path
    if str(order_id).startswith("dev_order_"):
        dev = DEV_SESSIONS.get(order_id)
        if not dev:
            raise HTTPException(status_code=400, detail="Invalid dev order")
        # If frontend provided a finalized itinerary preview, persist that instead
        provided = payload.get("final_itinerary") if isinstance(payload, dict) else None
        if provided:
            itin = models.Itinerary(
                user_name=payload.get("user_name"),
                origin_city=payload.get("origin_city"),
                destination_city_id=payload.get("destination_city_id"),
                days=payload.get("days"),
                budget_total=provided.get("budget_total", payload.get("budget_total")),
                budget_per_day=(provided.get("budget_total", payload.get("budget_total")) or 0) / max(1, payload.get("days", 1)),
                traveler_type=payload.get("traveler_type"),
                preferences=json.dumps(payload.get("preferences", [])),
                estimated_total_cost=provided.get("estimated_total_cost", 0),
                data=json.dumps({
                    "summary": provided.get("summary"),
                    "budget_fit": provided.get("budget_fit"),
                    "days": provided.get("days"),
                }),
            )
            db.add(itin)
            db.commit()
            db.refresh(itin)
            data = json.loads(itin.data)
            return {
                "id": itin.id,
                "summary": data["summary"],
                "budget_total": itin.budget_total,
                "estimated_total_cost": itin.estimated_total_cost,
                "days": data["days"],
                "city_name": itin.destination_city.name,
                "budget_fit": data["budget_fit"],
            }
        # create itinerary immediately from request
        itin = generate_itinerary(db, schemas.ItineraryRequest(**payload))
        data = json.loads(itin.data)
        return {
            "id": itin.id,
            "summary": data["summary"],
            "budget_total": itin.budget_total,
            "estimated_total_cost": itin.estimated_total_cost,
            "days": data["days"],
            "city_name": itin.destination_city.name,
            "budget_fit": data["budget_fit"],
        }

    # Real verification via Razorpay API
    if not RAZORPAY_KEY or not RAZORPAY_SECRET:
        raise HTTPException(status_code=400, detail="Razorpay credentials not configured")
    try:
        # fetch payment details
        import requests
        resp = requests.get(f"https://api.razorpay.com/v1/payments/{payment_id}", auth=(RAZORPAY_KEY, RAZORPAY_SECRET), timeout=10)
        resp.raise_for_status()
        paydata = resp.json()
        if paydata.get("status") != "captured":
            raise HTTPException(status_code=400, detail="Payment not captured")
        # If frontend provided finalized itinerary preview, persist that
        provided = payload.get("final_itinerary") if isinstance(payload, dict) else None
        if provided:
            itin = models.Itinerary(
                user_name=payload.get("user_name"),
                origin_city=payload.get("origin_city"),
                destination_city_id=payload.get("destination_city_id"),
                days=payload.get("days"),
                budget_total=provided.get("budget_total", payload.get("budget_total")),
                budget_per_day=(provided.get("budget_total", payload.get("budget_total")) or 0) / max(1, payload.get("days", 1)),
                traveler_type=payload.get("traveler_type"),
                preferences=json.dumps(payload.get("preferences", [])),
                estimated_total_cost=provided.get("estimated_total_cost", 0),
                data=json.dumps({
                    "summary": provided.get("summary"),
                    "budget_fit": provided.get("budget_fit"),
                    "days": provided.get("days"),
                }),
            )
            db.add(itin)
            db.commit()
            db.refresh(itin)
            data = json.loads(itin.data)
            return {
                "id": itin.id,
                "summary": data["summary"],
                "budget_total": itin.budget_total,
                "estimated_total_cost": itin.estimated_total_cost,
                "days": data["days"],
                "city_name": itin.destination_city.name,
                "budget_fit": data["budget_fit"],
            }
        # create itinerary
        itin = generate_itinerary(db, schemas.ItineraryRequest(**payload))
        data = json.loads(itin.data)
        return {
            "id": itin.id,
            "summary": data["summary"],
            "budget_total": itin.budget_total,
            "estimated_total_cost": itin.estimated_total_cost,
            "days": data["days"],
            "city_name": itin.destination_city.name,
            "budget_fit": data["budget_fit"],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/confirm")
def confirm_payment(session_id: str, db: Session = Depends(get_db)):
    try:
        # Dev session shortcut
        if session_id.startswith("dev_"):
            dev = DEV_SESSIONS.get(session_id)
            if not dev:
                raise HTTPException(status_code=400, detail="Invalid dev session")
            # Simulate a paid session
            session = type("S", (), {"payment_status": "paid", "metadata": {"payload": json.dumps(dev["payload"])}})()
        else:
            session = stripe.checkout.Session.retrieve(session_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid session: {e}")

    if session.payment_status != "paid":
        raise HTTPException(status_code=400, detail="Payment not completed")

    # retrieve payload from metadata
    metadata_payload = session.metadata.get("payload")
    if not metadata_payload:
        raise HTTPException(status_code=400, detail="No payload in session metadata")

    try:
        payload = json.loads(metadata_payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid payload JSON")

    # create itinerary using existing generator
    try:
        itin = generate_itinerary(db, schemas.ItineraryRequest(**payload))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    data = json.loads(itin.data)
    return {
        "id": itin.id,
        "summary": data["summary"],
        "budget_total": itin.budget_total,
        "estimated_total_cost": itin.estimated_total_cost,
        "days": data["days"],
        "city_name": itin.destination_city.name,
        "budget_fit": data["budget_fit"],
    }


@router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request, x_razorpay_signature: str = Header(None), db: Session = Depends(get_db)):
    """Razorpay webhook receiver. Verifies signature and processes payment.success events.
    Set `RAZORPAY_WEBHOOK_SECRET` env var to verify signatures. In dev mode, signature check is skipped if not configured.
    """
    raw = await request.body()
    try:
        payload = json.loads(raw.decode('utf-8'))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    # verify signature if secret provided
    if RAZORPAY_WEBHOOK_SECRET:
        if not x_razorpay_signature:
            raise HTTPException(status_code=400, detail="Missing signature header")
        computed = hmac.new(RAZORPAY_WEBHOOK_SECRET.encode('utf-8'), raw, hashlib.sha256).hexdigest()
        # Razorpay sends signature base64? they send hex digest; accept both
        if not hmac.compare_digest(computed, x_razorpay_signature):
            # try base64 encoding check
            import base64
            if not hmac.compare_digest(base64.b64encode(hmac.new(RAZORPAY_WEBHOOK_SECRET.encode('utf-8'), raw, hashlib.sha256).digest()).decode(), x_razorpay_signature):
                raise HTTPException(status_code=400, detail="Invalid signature")

    # process event
    event = payload.get('event') or payload.get('payload', {}).get('event')
    # The shape varies; attempt to extract payment info
    if 'event' in payload and payload.get('event') == 'payment.captured':
        # typical shape
        payment = payload.get('payload', {}).get('payment', {}).get('entity', {})
    else:
        # fallback - try common keys
        payment = (payload.get('payload', {}) or {}).get('payment', {}).get('entity', {})

    payment_id = payment.get('id')
    order_id = payment.get('order_id') or payment.get('receipt')

    if not payment_id:
        return {"status": "ignored"}

    # If we created a dev session earlier with order id, use it
    if order_id and str(order_id).startswith('dev_order_'):
        dev = DEV_SESSIONS.get(order_id)
        if not dev:
            return {"status": "unknown dev order"}
        # use payload from dev session to create itinerary
        itin = generate_itinerary(db, schemas.ItineraryRequest(**dev['payload']))
        data = json.loads(itin.data)
        return {"status": "ok", "itinerary_id": itin.id, "days": data['days']}

    # For real orders, you may need to lookup payload from DB or order metadata.
    # For now, return accepted.
    return {"status": "accepted"}
