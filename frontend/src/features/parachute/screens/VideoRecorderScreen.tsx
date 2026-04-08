import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BaseCamera from "../components/BaseCamera";
import BaseVideoPreview from "../components/BaseVideoPreview";

export default function VideoRecorderScreen() {
  const [video, setVideo] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // if theres a record, show preview
  if (video) {
    return (
      <SafeAreaView style={styles.container}>
        <BaseVideoPreview
          videoUri={video}
          onProceed={() => {
            setVideo(null);
          }}
          onRetake={() => setVideo(null)}
        />
      </SafeAreaView>
    );
  }

  // otherwise, show camera screen
  return (
    <SafeAreaView style={styles.container}>
      <BaseCamera
        onVideoCaptured={(uri) => setVideo(uri)}
        onReadyChange={() => setIsCameraReady(true)}
        isCameraReady={isCameraReady}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
