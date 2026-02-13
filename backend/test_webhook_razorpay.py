import requests, json, hmac, hashlib, base64, os

# Sends a simulated Razorpay payment.captured webhook to the backend
BACKEND='http://localhost:8000'
secret=os.environ.get('RAZORPAY_WEBHOOK_SECRET')

payload = {
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_test_123",
        "order_id": "dev_order_test123",
        "amount": 10000,
        "currency": "INR"
      }
    }
  }
}
raw = json.dumps(payload).encode('utf-8')
headers = {'Content-Type':'application/json'}
if secret:
    sig = hmac.new(secret.encode('utf-8'), raw, hashlib.sha256).hexdigest()
    headers['X-Razorpay-Signature'] = sig

r = requests.post(BACKEND + '/api/payments/webhook/razorpay', data=raw, headers=headers, timeout=10)
print(r.status_code)
print(r.text)
