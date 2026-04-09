import CalculationFlow from "@/src/features/parachute/screens/CalculationScreen";
import { useRouter } from "expo-router";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalculationScreen() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <CalculationFlow />
      <Button
        title="Another attempt"
        onPress={() => router.push("/activity/activity1/recordVideo")}
      />
    </SafeAreaView>
  );
}
