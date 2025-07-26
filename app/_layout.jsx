import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { setGlobalRouter } from "../navigation/globalNavigation";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    setGlobalRouter(router);
  }, [router]);

  return (
  <Stack screenOptions={{
    headerShown :  false
  }}>
    <Stack.Screen name="index" options={{ title: "Welcome"}}/>
    <Stack.Screen name="auth/login" />
    <Stack.Screen name="verifyPhone/verifyPhone" />
    <Stack.Screen name="home/home" />
    <Stack.Screen name="need/needList" />
    <Stack.Screen name="profile/userProfile" />
    <Stack.Screen name="donation/donationList" />
  </Stack>
);
}
