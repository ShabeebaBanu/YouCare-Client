import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { setGlobalRouter } from "../navigation/globalNavigation";
import { loadToken } from "@/services/authService";

export default function RootLayout() {
  const router = useRouter();

  const initAuth = async () => {
    await loadToken();
  }

  useEffect(() => {
    setGlobalRouter(router);
    initAuth()
  }, [router]);

  return (
  <Stack screenOptions={{
    headerShown :  false
  }}>
    <Stack.Screen name="index" options={{ title: "Welcome"}}/>
    <Stack.Screen name="auth/login" />
    <Stack.Screen name="verifyEmail/verifyEmail" />
    <Stack.Screen name="home/home" />
    <Stack.Screen name="need/needList" />
    <Stack.Screen name="need/needProfile" />
    <Stack.Screen name="need/publicProfile" />
    <Stack.Screen name="profile/userProfile" />
    <Stack.Screen name="donation/donationList" />
    <Stack.Screen name="donation/donationProfile" />
    <Stack.Screen name="donation/confirmation" />
    <Stack.Screen name="donation/requestList" />
    <Stack.Screen name="notification/notification" />
  </Stack>
);
}
