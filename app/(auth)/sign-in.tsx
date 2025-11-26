import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import {Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import InputField from "@/components/InputField";

const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const onSignInPress = useCallback(async () => {
        if (!isLoaded) return;

        try {
            const signInAttempt = await signIn.create({
                identifier: form.email,
                password: form.password,
            });

            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace("/(root)/(screens)/welcome");
            } else {
                // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
                console.log(JSON.stringify(signInAttempt, null, 2));
                Alert.alert("Error", "Log in failed. Please try again.");
            }
        } catch (err: any) {
            console.log(JSON.stringify(err, null, 2));
            Alert.alert("Error", err?.errors?.[0]?.longMessage || "Something Failed. Please try again.");
        }
    }, [isLoaded, form]);

    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={styles.background}
        >
            <View style={styles.content}>
                <View className="relative w-full h-[250px]">
                    <Image src={"@/assets/images/background.jpg"} className="z-0 w-full h-[250px]" />
                    <Text style={styles.title}>
                        Welcome 👋
                    </Text>
                </View>

                <View>
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
                        onPress={onSignInPress}
                        accessibilityRole="button"
                    >
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>
                    <Text></Text>
                    <Text></Text>
                    <Text></Text>
                    <Link
                        href="/sign-up"
                        className="text-lg text-center text-general-200 mt-10"
                    >
                        <Text style={styles.buttonText}>Don't have an account? {" "} Sign Up</Text>
                    </Link>
                </View>
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

export default SignIn;