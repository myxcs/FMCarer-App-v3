import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const { checkAuth, user, token, isCheckingAuth } = useAuthStore();

  // Kiểm tra đăng nhập khi mở app
  useEffect(() => {
    checkAuth();
  }, []);



  // Điều hướng khi có thay đổi user/token và đã mount layout
  useEffect(() => {
    if (!navigationState?.key || isCheckingAuth) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments, navigationState?.key, isCheckingAuth]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
         
         <Stack.Screen name="(tabs)" />
       <Stack.Screen name="(auth)" />
       
      </Stack>
    </SafeAreaProvider>
  );
}
