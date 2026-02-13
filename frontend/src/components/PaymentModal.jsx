import React from "react";

export default function PaymentModal({ amount, breakdown, payload, onClose, onSuccess }) {
  const [method, setMethod] = React.useState('card');
  const [loading, setLoading] = React.useState(false);
  const [devOrder, setDevOrder] = React.useState(null);
  const upiId = import.meta.env.VITE_UPI_ID || 'xxxxxxxx@upi';

  async function handlePay() {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8000";
      const resp = await fetch(`${apiBase}/api/payments/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, amount, method })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || JSON.stringify(data));

      // Dev mode: keep the order and show a simulated checkout so user can see a payment window locally
      if (data.dev) {
        setDevOrder(data);
        setLoading(false);
        return;
      }

      // Load Razorpay checkout script
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      const options = {
        key: data.key,
        amount: amount * 100,
        currency: 'INR',
        name: 'YatraGenie',
        description: `Itinerary for ${payload.destination_city_name || 'your trip'}`,
        order_id: data.order_id,
        handler: async function (response) {
          try {
            const apiResp = await fetch(`${apiBase}/api/payments/confirm-razorpay`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_id: data.order_id, payment_id: response.razorpay_payment_id, payload, method })
            });
            const resJson = await apiResp.json();
            if (!apiResp.ok) throw new Error(resJson.detail || JSON.stringify(resJson));
            onSuccess(resJson);
          } catch (err) {
            alert('Payment succeeded but confirmation failed: ' + err.message);
          }
        },
        modal: { ondismiss: () => {} },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment initialization failed: ' + (err.message || err));
      onClose();
    } finally {
      setLoading(false);
    }
  }

  async function handleSimulatePay() {
    if (!devOrder) return;
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8000";
      const conf = await fetch(`${apiBase}/api/payments/confirm-razorpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // For dev, send a simulated payment token and mask any sensitive fields
        body: JSON.stringify({ order_id: devOrder.order_id, payment_id: `dev_pay_${Date.now()}`, payload: { ...(payload || {}), payment_meta: { method, token: `tok_dev_${Date.now()}` } } })
      });
      const result = await conf.json();
      if (!conf.ok) throw new Error(result.detail || JSON.stringify(result));
      onSuccess(result);
    } catch (err) {
      alert('Simulated payment failed: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  // card/netbanking form state
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardExp, setCardExp] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');
  const [bankName, setBankName] = React.useState('');

  function luhnCheck(num) {
    const s = num.replace(/\D/g, '');
    let sum = 0, shouldDouble = false;
    for (let i = s.length - 1; i >= 0; i--) {
      let d = parseInt(s.charAt(i), 10);
      if (shouldDouble) { d *= 2; if (d > 9) d -= 9; }
      sum += d; shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  }

  async function handleCardPay() {
    // basic validation
    if (!luhnCheck(cardNumber)) { alert('Invalid card number'); return; }
    if (!/^[0-9]{3,4}$/.test(cardCvv)) { alert('Invalid CVV'); return; }
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExp)) { alert('Invalid expiry (MM/YY)'); return; }
    setLoading(true);
    try {
      // simulate tokenization (DO NOT send raw card data to server in production)
      const token = `tok_sim_${Date.now()}`;
      const masked = (cardNumber.replace(/\s+/g,'').slice(-4)).padStart(4,'*');
      // send confirm to backend with masked/payment_meta
      const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8000";
      const conf = await fetch(`${apiBase}/api/payments/confirm-razorpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: devOrder?.order_id || `card_order_${Date.now()}`, payment_id: `card_tx_${Date.now()}`, payload: { ...(payload||{}), payment_meta: { method: 'card', token, card_last4: cardNumber.replace(/\D/g,'').slice(-4) } } })
      });
      const result = await conf.json();
      if (!conf.ok) throw new Error(result.detail || JSON.stringify(result));
      onSuccess(result);
    } catch (err) {
      alert('Card payment failed: ' + (err.message || err));
    } finally { setLoading(false); }
  }

  async function handleNetbankingPay() {
    if (!bankName) { alert('Select a bank'); return; }
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8000";
      const conf = await fetch(`${apiBase}/api/payments/confirm-razorpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: devOrder?.order_id || `nb_order_${Date.now()}`, payment_id: `nb_tx_${Date.now()}`, payload: { ...(payload||{}), payment_meta: { method: 'netbanking', bank: bankName, token: `tok_nb_${Date.now()}` } } })
      });
      const result = await conf.json();
      if (!conf.ok) throw new Error(result.detail || JSON.stringify(result));
      onSuccess(result);
    } catch (err) {
      alert('Netbanking payment failed: ' + (err.message || err));
    } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-[rgba(6,6,20,0.9)] text-gray-100 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-[rgba(255,255,255,0.04)]">
        <h3 className="text-2xl font-semibold mb-4">Confirm Payment</h3>
        <div className="mb-4 text-sm text-gray-300">
          <p className="mb-1"><strong>Destination:</strong> {payload?.destination_city_name || "-"}</p>
          <p className="mb-1"><strong>People:</strong> {payload?.people || 1} • <strong>Days:</strong> {payload?.days || 1}</p>
          <p className="mt-2"><strong>Why this amount?</strong></p>
          <ul className="list-none ml-0 mt-2 space-y-1">
            <li className="flex justify-between"><span>Base rate</span><span>₹{breakdown?.base}</span></li>
            <li className="flex justify-between"><span>People × Days</span><span>₹{breakdown?.peopleDaysTotal}</span></li>
            <li className="flex justify-between"><span>Preferences surcharge</span><span>₹{breakdown?.prefSurcharge}</span></li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="mb-2"><strong>Payment method</strong></p>
          <div className="flex gap-3 items-center">
            <label className="text-sm"><input type="radio" name="method" value="card" checked={method==='card'} onChange={() => setMethod('card')} /> <span className="ml-2">Card</span></label>
            <label className="text-sm"><input type="radio" name="method" value="upi" checked={method==='upi'} onChange={() => setMethod('upi')} /> <span className="ml-2">UPI</span></label>
            <label className="text-sm"><input type="radio" name="method" value="netbanking" checked={method==='netbanking'} onChange={() => setMethod('netbanking')} /> <span className="ml-2">Netbanking</span></label>
          </div>
        </div>

        <p className="mb-4 text-lg">Total to pay: <span className="font-bold text-orange-400">₹{amount}</span></p>

        {method === 'upi' && (
          <div className="mb-4 p-3 bg-[rgba(255,255,255,0.02)] rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">Pay via UPI ID</div>
                <div className="font-mono mt-1 text-gray-100">{upiId}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-3 py-1 rounded-md border border-[rgba(255,255,255,0.06)] text-sm" onClick={() => navigator.clipboard?.writeText(upiId)}>Copy</button>
                <button className="px-3 py-1 rounded-md bg-red-600 text-white" onClick={async () => {
                  // simulate UPI completed (dev)
                  try {
                    setLoading(true);
                    if (devOrder) {
                      await handleSimulatePay();
                    } else {
                      // in non-dev mode, still call confirm with a fake upi tx id
                      const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8000";
                      const conf = await fetch(`${apiBase}/api/payments/confirm-razorpay`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ order_id: devOrder?.order_id || `upi_order_${Date.now()}`, payment_id: `upi_tx_${Date.now()}`, payload, method })
                      });
                      const result = await conf.json();
                      if (!conf.ok) throw new Error(result.detail || JSON.stringify(result));
                      onSuccess(result);
                    }
                  } catch (err) {
                    alert('UPI confirmation failed: ' + (err.message || err));
                  } finally { setLoading(false); }
                }}>I've paid</button>
              </div>
            </div>
          </div>
        )}
        {devOrder && (
          <div className="mb-4 p-4 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <div className="text-sm text-gray-300 mb-2">Test mode: Razorpay not configured. Use the simulator to complete payment.</div>
            <div className="flex justify-between items-center">
              <div className="text-sm">Order ID: <span className="font-mono text-xs text-gray-200">{devOrder.order_id}</span></div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-md bg-red-600 text-white" onClick={handleSimulatePay} disabled={loading}>
                  {loading ? 'Processing...' : 'Simulate Razorpay'}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">Secure payment. You'll get the full itinerary after payment.</div>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.04)] text-gray-200" onClick={onClose}>Cancel</button>
            <button
              className="px-4 py-2 rounded-lg orange-btn"
              onClick={handlePay}
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
