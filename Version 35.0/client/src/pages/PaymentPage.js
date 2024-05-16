import React, { useState } from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectCurrentOrder } from '../features/order/orderSlice';

import '../Payment.css';

function PaymentPage() {
    const [paymentSuccessToken, setPaymentSuccessToken] = useState('');
    const currentOrder = useSelector(selectCurrentOrder);

    return (
        <div id='payment-page'>
            {paymentSuccessToken !== '' && <Navigate to={`/order-success/${currentOrder.id}`} replace={true}></Navigate>}

            <h1>Pay with your Card</h1>
            <div id="payment-form">
                <PaymentForm
                    /**
                     * Identifies the calling form with a verified application ID generated from
                     * the Square Application Dashboard.
                     */
                    applicationId="sandbox-sq0idb-dxbQH8c9ntE_7QV6pyF8og"
                    /**
                     * Invoked when payment form receives the result of a tokenize generation
                     * request. The result will be a valid credit card or wallet token, or an error.
                     */
                    cardTokenizeResponseReceived={async (token, buyer) => {
                        const myToken = await token;
                        setPaymentSuccessToken(myToken);
                        console.log({ token, buyer });
                    }}
                    /**
                     * This function enable the Strong Customer Authentication (SCA) flow
                     *
                     * We strongly recommend use this function to verify the buyer and reduce
                     * the chance of fraudulent transactions.
                     */
                    createVerificationDetails={() => ({
                        amount: (`${currentOrder.totalAmount}`),
                        /* collected from the buyer */
                        billingContact: {
                            addressLines: ['123 Main Street', 'Apartment 1'],
                            familyName: 'Doe',
                            givenName: 'John',
                            countryCode: 'GB',
                            city: 'London',
                        },
                        currencyCode: 'INR',
                        intent: 'CHARGE',
                    })}
                    /**
                     * Identifies the location of the merchant that is taking the payment.
                     * Obtained from the Square Application Dashboard - Locations tab.
                     */
                    locationId="LVN8DKK0HRF0S"
                >
                    <CreditCard />
                </PaymentForm>
            </div>
        </div>
    )
}

export default PaymentPage;
