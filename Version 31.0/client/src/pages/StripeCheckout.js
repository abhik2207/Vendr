import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import "../Stripe.css";
import { useSelector } from "react-redux";
import { selectCurrentOrder } from "../features/order/orderSlice";

const stripePromise = loadStripe("pk_test_51OtmPySJmByaG9Y1sNs1LpZvNFLwQkgwxZfNUPrzSfd9yNmpV5TKQIhMRLpmz1WUNhJi9j1VqfGclbVp28J4Zdqu00pCOE2c14");

function StripeCheckout() {
    const [clientSecret, setClientSecret] = useState("");
    const currentOrder = useSelector(selectCurrentOrder);

    useEffect(() => {
        fetch("/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalAmount: currentOrder.totalAmount, orderId: currentOrder.id }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [currentOrder]);

    const appearance = {
        theme: 'stripe',
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="Stripe">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
}

export default StripeCheckout;