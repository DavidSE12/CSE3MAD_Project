import { useState } from "react";
import { StyleSheet, View } from "react-native";
import CameraModule from "./CameraModule";
import VideoPreview from "./VideoPreview";

export default function VideoRecorder() {
  const [video, setVideo] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // if theres a record, show preview
  if (video) {
    return (
      <VideoPreview
        videoUri={video}
        onProceed={() => console.log("Proceeded successfully")}
        onRetake={() => setVideo(null)}
      />
    );
  }

  // otherwise, show camera screen
  return (
    <View style={styles.container}>
      <CameraModule
        onVideoCaptured={(uri) => setVideo(uri)}
        onReadyChange={() => setIsCameraReady(true)}
        isCameraReady={isCameraReady}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
