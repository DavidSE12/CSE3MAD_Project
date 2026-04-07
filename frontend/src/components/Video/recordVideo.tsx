import VideoRecorder from "@/src/components/Video/VideoRecorder";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RecordVideo() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <VideoRecorder />
    </GestureHandlerRootView>
  );
}
