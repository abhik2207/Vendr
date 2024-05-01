import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import "../Stripe.css";
import { useSelector } from "react-redux";
import { selectCurrentOrder } from "../features/order/orderSlice";


const stripePromise = loadStripe("pk_test_51PBYfMSG1m7bvcI2lFSsx4trACxt6vOb08h9Yzxw9whQR4pp9f7bRdto5yq4xcDZ5XXBBosvR5al7ozVKkclBxJU003Z9fGqca");

export default function StripeCheckout() {
    const [clientSecret, setClientSecret] = useState("");
    const currentOrder = useSelector(selectCurrentOrder);

    useEffect(() => {
        fetch("http://localhost:8080/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalAmount: currentOrder.totalAmount }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [currentOrder.totalAmount]);

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