import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar, TextInput, Keyboard, Alert } from "react-native";
import { useRouter } from "expo-router";
import Payment from "@/components/Payment";
import {StripeProvider} from "@stripe/stripe-react-native";
import {useUser} from "@clerk/clerk-expo"

const Donation = () => {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const { user, isLoaded } = useUser();

    // Debug logs
    useEffect(() => {
        if (isLoaded) {
            console.log("👤 User loaded:");
            console.log("Full Name:", user?.fullName);
            console.log("First Name:", user?.firstName);
            console.log("Last Name:", user?.lastName);
            console.log("Email:", user?.emailAddresses[0]?.emailAddress);
        }
    }, [isLoaded, user]);

    //Construct a name from available data
    const getUserName = () => {
        if (user?.fullName) return user.fullName;
        if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
        if (user?.firstName) return user.firstName;
        if (user?.emailAddresses[0]?.emailAddress) {
            // Fallback: use email username as name
            return user.emailAddresses[0].emailAddress.split('@')[0];
        }
        return "Anonymous Donor";
    };

    if (!isLoaded) {
        return (
            <ImageBackground
                source={require('@/assets/images/background.jpg')}
                style={styles.background}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Loading...</Text>
                </View>
            </ImageBackground>
        );
    }

    return (
        <StripeProvider
        publishableKey={String(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!)}
        merchantIdentifier={"merchant.kingsharvest.com"}
        urlScheme={"kingsharvest"}>
            <ImageBackground
                source={require('@/assets/images/background.jpg')}
                style={styles.background}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <View style={styles.content}>
                    <Text style={styles.title}>Thank you for giving!</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dollarSign}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            keyboardType="decimal-pad"
                            returnKeyType="done"
                            value={amount}
                            onChangeText={setAmount}
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />
                    </View>
                    <Payment
                        amountPaid={amount}
                        fullName={getUserName()}
                        email={user?.emailAddresses[0].emailAddress || ""}
                    />
                </View>
                <StatusBar barStyle="light-content" />
            </ImageBackground>
        </StripeProvider>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '600',
    },
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
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 12,
        zIndex: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        overflow: 'hidden',
        elevation: 5,
    },
    backButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        minWidth: 200,
    },
    dollarSign: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '600',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 20,
        color: '#fff',
        fontWeight: '600',
        padding: 0,
    },
});

export default Donation;