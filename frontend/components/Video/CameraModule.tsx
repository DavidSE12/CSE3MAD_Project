import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CameraModuleProps {
  onVideoCaptured: (uri: string) => void;
  onReadyChange: (isReady: boolean) => void;
  isCameraReady: boolean;
}

export default function CameraModule({
  onVideoCaptured,
  onReadyChange,
  isCameraReady,
}: CameraModuleProps) {
  // Camera Facing State
  const [facing, setFacing] = useState<CameraType>("back");
  const [isRecording, setIsRecording] = useState(false);

  const [uploadVideo, setUploadVideo] = useState(false);

  //
  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        quality: 1,
        selectionLimit: 1, // Only 1 video
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        onVideoCaptured(result.assets[0].uri);
        console.log("Video selected from gallery:", result.assets[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Grant Permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = useMicrophonePermissions();

  // Reference to the CameraView component to control recording
  const cameraRef = useRef<CameraView | null>(null);

  // permission still loading
  if (!cameraPermission || !audioPermission) {
    return <View />; // Show loading state in here later
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
    onReadyChange(false);
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

      if (videoResult) onVideoCaptured(videoResult?.uri);
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

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        mode="video"
        onCameraReady={() => {
          console.log("Camera is ready");
          onReadyChange(true);
        }}
        onMountError={(error) => console.log("Camera mount error", error)}
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

        <Button
          title={uploadVideo ? "Upload Video" : "UploadVideo"}
          onPress={pickFromGallery}
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
