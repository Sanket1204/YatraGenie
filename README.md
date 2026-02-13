# YatraGenie (local dev)

This workspace contains a React + Vite frontend and a FastAPI backend for an AI-assisted itinerary generator.

Quick start (dev):

1. Backend

- Create a Python virtualenv and install requirements:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

- Set env vars (optional for payments):

```
# optional
set RAZORPAY_KEY=your_key
set RAZORPAY_SECRET=your_secret
set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
set STRIPE_SECRET_KEY=sk_test_...
set FRONTEND_URL=http://localhost:5176
```

- Start backend:

```powershell
cd backend
./run_backend.ps1
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev
# open http://localhost:5176/
```

Payments

- The app contains a dev fallback: if payment keys are not configured, the backend will create `dev_order_*` sessions and immediately confirm when frontend calls confirm.
- For production, provide real `RAZORPAY_KEY`, `RAZORPAY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` and remove dev fallback.

Webhooks

- The backend exposes `/api/payments/webhook/razorpay`. Set your Razorpay webhook URL to this endpoint and configure the webhook secret in `RAZORPAY_WEBHOOK_SECRET`.

Testing webhooks locally

- Use `backend/test_webhook_razorpay.py` to simulate a Razorpay `payment.captured` webhook (it will sign the payload if you set `RAZORPAY_WEBHOOK_SECRET`).

What's left

- Optionally wire Stripe webhooks and add deployment docs.
- Improve payload storage: in production you should store order->payload mapping in DB so webhooks can look up the original request.

