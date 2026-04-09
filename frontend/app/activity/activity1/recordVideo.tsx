import VideoRecorderScreen from "@/src/features/parachute/screens/VideoRecorderScreen";
import { useRouter } from "expo-router";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecordVideoScreen() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <VideoRecorderScreen />
      <Button
        title="Proceed"
        onPress={() => router.push("/activity/activity1/calculation")}
      />
    </SafeAreaView>
  );
}
