import {
    TextInput,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform, StyleSheet,
} from "react-native";

import {InputFieldProps} from "@/types/type";

const InputField = ({
                        label,
                        icon,
                        secureTextEntry = false,
                        labelStyle,
                        containerStyle,
                        inputStyle,
                        iconStyle,
                        className,
                        ...props
                    }: InputFieldProps) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <Text style={styles.buttonText}>
                        {label}
                    </Text>
                    <View
                        className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500  ${containerStyle}`}
                    >
                        {icon && (
                            <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`}/>
                        )}
                        <TextInput
                            style={styles.inputContainer}
                            returnKeyType="done"
                            secureTextEntry={secureTextEntry}
                            {...props}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 18,             // bigger label text
        color: '#fff',
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        minWidth: 200,
    },
    amountInput: {
        flex: 1,
        fontSize: 20,
        color: '#fff',
        fontWeight: '600',
        padding: 0,
    },
});
export default InputField;