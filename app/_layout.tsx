import {ClerkLoaded, ClerkProvider} from '@clerk/clerk-expo'
import { Stack } from 'expo-router';
import { tokenCacheCall } from "@/lib/auth";
import { tokenCache } from "@clerk/clerk-expo/token-cache"
import 'react-native-reanimated';
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
      <ClerkProvider tokenCache={tokenCacheCall} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <ClerkLoaded>
              <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
                  <Stack.Screen name="(root)" options={{ headerShown: false }}/>
              </Stack>
          </ClerkLoaded>
      </ClerkProvider>
  );
}
