import { Stack } from 'expo-router';
import 'react-native-reanimated';
export const unstable_settings = {
    anchor: '(tabs)',
};

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="sign-up" options={{ headerShown: false }}/>
            <Stack.Screen name="sign-in" options={{ headerShown: false }}/>
        </Stack>
    );
}

export default Layout;