import {View, Text, StyleSheet, TouchableOpacity, StatusBar, Linking} from "react-native";
import {useRouter} from "expo-router";
import {ImageBackground} from "expo-image";

const Welcome = () => {
    const router = useRouter();
    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={styles.background}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to</Text>
                <Text style={styles.title}>King's Harvest</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/donation')}
                    accessibilityRole="button"
                >
                    <Text style={styles.buttonText}>Offering</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => Linking.openURL("https://thekingsharvestchurch.org/")}
                    accessibilityRole="button"
                >
                    <Text style={styles.buttonText}>Website</Text>
                </TouchableOpacity>
            </View>
            <StatusBar barStyle="light-content" />
        </ImageBackground>
    );
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
});

export default Welcome;