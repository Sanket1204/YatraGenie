import requests, json, sys
base='http://localhost:8000'
payload={
  'origin_city':'Mumbai',
  'destination_city_id':1,
  'destination_city_name':'Goa',
  'people':2,
  'days':3,
  'budget_total':8000,
  'traveler_type':'couple',
  'preferences':['beach','food']
}
try:
    r = requests.post(base+ '/api/payments/create-razorpay-order', json={'payload':payload,'amount':1500}, timeout=10)
    print('create status', r.status_code)
    print(r.text)
    if r.status_code==200:
        d=r.json()
        if d.get('dev'):
            order_id=d['order_id']
            print('dev order id', order_id)
            c = requests.post(base + '/api/payments/confirm-razorpay', json={'order_id': order_id, 'payment_id': f'dev_pay_test', 'payload': payload}, timeout=10)
            print('confirm status', c.status_code)
            print(c.text[:2000])
        else:
            print('created real order (not dev)')
except Exception as e:
    print('error', e)
    sys.exit(1)
