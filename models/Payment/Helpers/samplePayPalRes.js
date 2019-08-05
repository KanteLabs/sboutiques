const res = {
    "payment": {
        "id": "PAY-3H121433E6786680SLM6VRDQ",
        "intent": "sale",
        "state": "approved",
        "cart": "2GT056425M039283C",
        "payer": {
            "payment_method": "paypal",
            "status": "VERIFIED",
            "payer_info": {
                "email": "kamdiou-buyer@gmail.com",
                "first_name": "test",
                "last_name": "buyer",
                "payer_id": "VS7P7D9JE8TDJ",
                "shipping_address": {
                    "recipient_name": "test buyer",
                    "line1": "1 Main St",
                    "city": "San Jose",
                    "state": "CA",
                    "postal_code": "95131",
                    "country_code": "US"
                },
                "country_code": "US"
            }
        },
        "transactions": [{
            "amount": {
                "total": "47.00",
                "currency": "USD",
                "details": {
                    "subtotal": "35.00",
                    "tax": "0.00",
                    "shipping": "12.00"
                }
            },
            "payee": {
                "merchant_id": "XMYS7PG5W2DMN",
                "email": "kamdiou-facilitator@gmail.com"
            },
            "description": "Purchase on Streetwear Boutiques from HYBRID, email: infohybridclo@gmail.com",
            "custom": "user_id: aPC8jOpzNHbiuxncyfIX7uY6GAk2, size: XL",
            "item_list": {
                "items": [{
                    "name": "Collection I T-shirt  Grey",
                    "sku": "1527006189346",
                    "description": "XL",
                    "price": "35.00",
                    "currency": "USD",
                    "quantity": 1
                }],
                "shipping_address": {
                    "recipient_name": "test buyer",
                    "line1": "1 Main St",
                    "city": "San Jose",
                    "state": "CA",
                    "postal_code": "95131",
                    "country_code": "US"
                }
            },
            "related_resources": [{
                "sale": {
                    "id": "5CX26575AC009805M",
                    "state": "completed",
                    "amount": {
                        "total": "47.00",
                        "currency": "USD",
                        "details": {
                            "subtotal": "35.00",
                            "shipping": "12.00"
                        }
                    },
                    "payment_mode": "INSTANT_TRANSFER",
                    "protection_eligibility": "ELIGIBLE",
                    "protection_eligibility_type": "ITEM_NOT_RECEIVED_ELIGIBLE,UNAUTHORIZED_PAYMENT_ELIGIBLE",
                    "transaction_fee": {
                        "value": "1.66",
                        "currency": "USD"
                    },
                    "parent_payment": "PAY-3H121433E6786680SLM6VRDQ",
                    "create_time": "2018-07-04T23:30:40Z",
                    "update_time": "2018-07-04T23:30:40Z",
                    "links": [{
                        "href": "https://api.sandbox.paypal.com/v1/payments/sale/5CX26575AC009805M",
                        "rel": "self",
                        "method": "GET"
                    }, {
                        "href": "https://api.sandbox.paypal.com/v1/payments/sale/5CX26575AC009805M/refund",
                        "rel": "refund",
                        "method": "POST"
                    }, {
                        "href": "https://api.sandbox.paypal.com/v1/payments/payment/PAY-3H121433E6786680SLM6VRDQ",
                        "rel": "parent_payment",
                        "method": "GET"
                    }]
                }
            }]
        }],
        "create_time": "2018-07-04T23:30:41Z",
        "links": [{
            "href": "https://api.sandbox.paypal.com/v1/payments/payment/PAY-3H121433E6786680SLM6VRDQ",
            "rel": "self",
            "method": "GET"
        }],
        "httpStatusCode": 200
    },
    "tokens": {
        "paymentId": "PAY-3H121433E6786680SLM6VRDQ",
        "token": "EC-2GT056425M039283C",
        "PayerID": "VS7P7D9JE8TDJ"
    }
}