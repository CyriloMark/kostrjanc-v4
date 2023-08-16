import React, { useState } from "react";

import { StripeProvider } from "@stripe/stripe-react-native";

export default function BuyMeACoffee() {
    const [publishableKey, setPublishableKey] = useState("");

    return <StripeProvider publishableKey=""></StripeProvider>;
}
