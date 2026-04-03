import { ResizeMode, Video } from "expo-av";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VideoRecorder() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const cameraRef = useRef<CameraView | null>(null);

  // permission still loading
  if (!cameraPermission || !audioPermission) {
    return <View />;
  }

  // permission not granted yet
  if (!cameraPermission.granted || !audioPermission) {
    return (
      <View>
        <Text>Camera Permission needs to be granted to record</Text>
        <Button
          onPress={() => {
            requestAudioPermission();
            requestCameraPermission();
          }}
          title="grant permission"
        />
      </View>
    );
  }

  // flip camera
  function toggleCameraFunction() {
    // reset readiness
    setIsCameraReady(false);
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleRecord = async () => {
    if (!cameraRef.current || !isCameraReady)
      return console.log("Record clicked but camera not ready");

    try {
      setIsRecording(true);
      console.log("Started recording...");

      const videoResult = await cameraRef.current.recordAsync({
        maxDuration: 90,
      });
      setVideo(videoResult?.uri ?? null);
      console.log("Video saved at: ", videoResult?.uri);
    } catch (error) {
      console.log(error);
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    if (cameraRef.current && isRecording) {
      console.log("Stopping recording...");
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  // after recording
  if (!isRecording && video) {
    return (
      <View style={styles.container}>
        <Video
          style={styles.fullPreview}
          source={{ uri: video }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />
        <View style={styles.previewControls}>
          <Button title="Discard & Retake" onPress={() => setVideo(null)} />
          {/* empty for now */}
          <Button title="Proceed" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        mode="video"
        onCameraReady={() => {
          console.log("Camera is ready");
          setIsCameraReady(true);
        }}
      />
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.buttonFlip}
          onPress={toggleCameraFunction}
        >
          <Text>Flip camera</Text>
        </TouchableOpacity>

        <Button
          // disable button if camera is not ready
          disabled={!isCameraReady}
          title={isRecording ? "Stop Recording" : "Record Video"}
          onPress={isRecording ? handleStopRecording : handleRecord}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonFlip: {},
  video: {
    flex: 1,
    alignSelf: "stretch",
  },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  fullPreview: {
    flex: 1,
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
