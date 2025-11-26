import {useSignUp} from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { ReactNativeModal } from "react-native-modal";
import InputField from "@/components/InputField";

const SignUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: "",
    });

    const onSignUpPress = async () => {
        if (!isLoaded) return;
        try {
            const nameParts = form.name.trim().split(" ");
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(" ");

            await signUp.create({
                emailAddress: form.email,
                password: form.password,
                firstName: firstName,
                lastName: lastName,
            });
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setVerification({
                ...verification,
                state: "pending",
            });
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.log(JSON.stringify(err, null, 2));
            Alert.alert("Error", err.errors[0].longMessage);
        }
    };
    const onPressVerify = async () => {
        if (!isLoaded) return;
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            });
            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                setVerification({
                    ...verification,
                    state: "success",
                });
                console.log("Verification successfully");
            } else {
                setVerification({
                    ...verification,
                    error: "Verification failed. Please try again.",
                    state: "failed",
                });
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            setVerification({
                ...verification,
                error: err?.errors?.[0]?.longMessage || "Verification failed. Please try again.",
                state: "failed",
            });
        }
    };
    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={styles.background}
        >
            <View style={styles.content}>
                <View className="relative w-full h-[250px]">
                    <Text style={styles.title}>
                        Create Your Account
                    </Text>
                </View>
                <View className="p-5">
                    <InputField
                        label="Name"
                        placeholder="Enter name"
                        icon={"@/assets/icons/person.png"}
                        value={form.name}
                        onChangeText={(value: any) => setForm({ ...form, name: value })}
                    />
                    <InputField
                        label="Email"
                        placeholder="Enter email"
                        icon={"@/assets/icons/email.png"}
                        textContentType="emailAddress"
                        value={form.email}
                        onChangeText={(value: any) => setForm({ ...form, email: value })}
                    />
                    <InputField
                        label="Password"
                        placeholder="Enter password"
                        icon={"@/assets/icons/lock.png"}
                        secureTextEntry={true}
                        textContentType="password"
                        value={form.password}
                        onChangeText={(value: any) => setForm({ ...form, password: value })}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onSignUpPress}
                        accessibilityRole="button"
                    >
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <Link
                        href="/sign-in"
                        className="text-lg text-center text-general-200 mt-10"
                    >
                        <Text style={styles.buttonText}>Already have an account? {" "} Log In</Text>
                    </Link>
                </View>
                <ReactNativeModal
                    isVisible={verification.state === "pending"}
                    // onBackdropPress={() =>
                    //   setVerification({ ...verification, state: "default" })
                    // }
                    onModalHide={() => {
                        if (verification.state === "success") {
                            setShowSuccessModal(true);
                        }
                    }}
                >
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                        <Text style={styles.title}>
                            Verification
                        </Text>
                        <Text style={styles.buttonText}>
                            We've sent a verification code to {form.email}.
                        </Text>
                        <InputField
                            label={"Code"}
                            icon={"@/assets/icons/lock.png"}
                            placeholder={"12345"}
                            value={verification.code}
                            keyboardType="numeric"
                            onChangeText={(code: any) =>
                                setVerification({ ...verification, code })
                            }
                        />
                        {verification.error && (
                            <Text className="text-red-500 text-sm mt-1">
                                {verification.error}
                            </Text>
                        )}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onPressVerify}
                            accessibilityRole="button"
                        >
                            <Text style={styles.buttonText}>Verify Email</Text>
                        </TouchableOpacity>
                    </View>
                </ReactNativeModal>
                <ReactNativeModal isVisible={showSuccessModal}>
                    <View style={styles.content}>
                        <Image
                            source={require('@/assets/images/check.png')}
                            style={{ width: 110, height: 110, alignSelf: "center", marginVertical: 20 }}
                        />
                        <Text style={styles.title}>
                            Verified!
                        </Text>
                        <Text style={styles.buttonText}>
                            You have successfully verified your account.
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => router.replace('/(root)/(screens)/welcome')}
                            accessibilityRole="button"
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </ReactNativeModal>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        paddingHorizontal: 20,
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
    title: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '600',
    },
});
export default SignUp;