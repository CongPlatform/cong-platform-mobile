import { Redirect } from "expo-router";
import { useSession } from "@/contexts/SessionContext";

export default function Index() {
  const {
    user,
    account,
    loading,
  } = useSession();

  if (loading) {
    return null;
  }

  if (!user || !account) {
    return (
      <Redirect href="/login/Login" />
    );
  }

  switch (account.onboardingStep) {
    case "identity":
      return (
        <Redirect href="/firstaccess/FirstAccess" />
      );

    case "roles":
      return (
        <Redirect href="/roleselection/RoleSelection" />
      );

    case "profiles":
      return (
        <Redirect href="/completeprofiles/CompleteProfiles" />
      );

    case "completed":
      return (
        <Redirect href="/(tabs)/community" />
      );

    default:
      return (
        <Redirect href="/login/Login" />
      );
  }
}