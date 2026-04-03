import os
import razorpay
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel

router = APIRouter(
    prefix="/payment",
    tags=["payment"],
)

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_SYy7u1mZ0SjXdd")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "CAgoaWqzD9eiAH0il5Zo8fx2")

try:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception as e:
    razorpay_client = None

class CreateOrderRequest(BaseModel):
    amount: int  # Amount in INR
    currency: str = "INR"
    receipt: str = "order_rcptid_11"

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order")
def create_order(order_req: CreateOrderRequest):
    if not razorpay_client or RAZORPAY_KEY_ID.startswith("rzp_test_DUMMYKEY"):
        # For testing purposes when dummy keys are present, we mock it.
        return {"id": "order_mock_12345", "amount": order_req.amount * 100, "currency": order_req.currency}

    data = {
        "amount": order_req.amount * 100,  # Razorpay expects amount in paise
        "currency": order_req.currency,
        "receipt": order_req.receipt,
    }
    try:
        payment_order = razorpay_client.order.create(data=data)
        return payment_order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
def verify_payment(verify_data: VerifyPaymentRequest):
    if not razorpay_client or RAZORPAY_KEY_ID.startswith("rzp_test_DUMMYKEY"):
        return {"status": "success", "message": "Mock verification successful"}

    try:
        params_dict = {
            'razorpay_order_id': verify_data.razorpay_order_id,
            'razorpay_payment_id': verify_data.razorpay_payment_id,
            'razorpay_signature': verify_data.razorpay_signature
        }
        razorpay_client.utility.verify_payment_signature(params_dict)
        return {"status": "success", "message": "Payment signature verified successfully"}
    except razorpay.errors.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Signature verification failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
