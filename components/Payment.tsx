import {Alert, StyleSheet, Text, TouchableOpacity} from "react-native";
import React, {useEffect, useState} from "react";
import {useStripe} from "@stripe/stripe-react-native";
import {fetchAPI} from "@/lib/fetch";
import {PaymentProps} from "@/types/type";
import {useAuth} from "@clerk/clerk-expo";

const Payment = ({
     amountPaid,
     fullName,
     email
}: PaymentProps) => {

    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const {userId} = useAuth();
    const [success, setSuccess] = useState<boolean>(false);
    const [amount, setAmount] = useState(amountPaid);
    useEffect(() => {
        setAmount(amountPaid);
    }, [amountPaid])


    const openPaymentSheet = async () => {
        console.log("🟠 BUTTON PRESSED - Starting payment flow");
        console.log("Amount:", amount, "Name:", fullName, "Email:", email);

        const initialized = await initializePaymentSheet();

        if (!initialized) {
            console.log("❌ Payment sheet failed to initialize");
            return;
        }
        console.log("🟣 About to present payment sheet");

        try{
            const { error } = await presentPaymentSheet();
            console.log("🟣 PRESENTED - Back from presentPaymentSheet");

            if (error) {
                console.error("🔴 Present Payment Sheet Error:", {
                    code: error.code,
                    message: error.message,
                });

                // User cancelled
                if (error.code === 'Canceled') {
                    console.log("ℹ️ User cancelled payment");
                    return;
                }

                Alert.alert(`Error code: ${error.code}`, error.message);
            }else{
                console.log("✅ Payment successful!");
                setSuccess(true);
                Alert.alert("Success", "Thank you for your donation!");
            }
        }catch (error) {
            console.error("🔴 Exception during present:", error);
            Alert.alert("Error", "Failed to present payment sheet");
        }

    };

    const initializePaymentSheet = async () => {
        console.log("🟡 Initializing payment sheet");
        console.log("Amount:", amount);
        console.log("Full Name:", fullName);
        console.log("Email:", email);
        try {
            // Create PaymentIntent on your server
            console.log("📤 Creating PaymentIntent on server...");
            const response = await fetchAPI('/(api)/(stripe)/create', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: fullName,
                    email: email,
                    amount: amount,
                }),
            });

            console.log("🟢 Server response:", JSON.stringify(response));

            const { paymentIntent, ephemeralKey, customer } = response;
            if (!paymentIntent || !ephemeralKey || !customer) {
                console.error("❌ Missing required fields in response:", response);
                Alert.alert("Error", "Failed to initialize payment");
                return false;
            }

            console.log("🔑 Initializing Stripe PaymentSheet...");
           const { error } = await initPaymentSheet({
               merchantDisplayName: "Kings Harvest",
               customerId: customer,
               customerEphemeralKeySecret: ephemeralKey.secret,
               paymentIntentClientSecret: paymentIntent.client_secret,
               allowsDelayedPaymentMethods: false,
               returnURL: "kingsharvest://donation",
            });

            if (error) {
                console.error("🔴 Init Payment Sheet Error:", error);
                Alert.alert("Initialization Error", error.message);
            } else {
                console.log("✅ Payment sheet initialized successfully");
                return true;
            }
        }catch (error) {
            console.error("🔴 Exception during init:", error);
            Alert.alert("Error", "Failed to initialize payment sheet");
            return false;
        }
    };

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => {
                if (!amount || parseFloat(amount) <= 0) {
                    Alert.alert('Whoops!', 'Please enter the amount you wish to donate');
                } else {
                    console.log("BUTTON PRESSED");
                    openPaymentSheet();
                }
            }}
            accessibilityRole="button"
        >
            <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 100,           // moves button down 100px
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingVertical: 14,      // vertical size
        paddingHorizontal: 28,    // horizontal size
        borderRadius: 16,
        minWidth: 200,            // sets a minimum width
        alignItems: 'center',     // center the text
        justifyContent: 'center',
        elevation: 5,             // Android shadow
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        overflow: 'hidden',
    },
    buttonText: {
        fontSize: 18,             // bigger label text
        color: '#fff',
        fontWeight: '600',
    }
});

export default Payment;