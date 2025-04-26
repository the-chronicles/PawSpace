import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import * as SplashScreen from "expo-splash-screen";

export default function Index() {
  const { user, isLoading } = useAuth();

  SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync, 2000);

  // Set the animation options. This is optional.
  // SplashScreen.setOptions({
  //   duration: 1000,
  //   fade: true,
  // });

  // While loading, don't redirect yet
  if (isLoading) {
    return null;
  }

  // If user is authenticated, redirect to main tabs, otherwise to onboarding
  return user ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/onboarding" />
  );
}
