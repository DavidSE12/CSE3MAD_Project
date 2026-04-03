import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VideoRecorder() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  // camera permission still loading

  if (!permission) {
    return <View />;
  }

  // permission not granted yet
  if (!permission.granted) {
    return (
      <View>
        <Text>Camera Permission needs to be granted to record</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // flip camera
  function toggleCameraFunction() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <TouchableOpacity
          style={styles.buttonFlip}
          onPress={toggleCameraFunction}
        >
          <Text>Flip camera</Text>
        </TouchableOpacity>
      </CameraView>
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
  },
});
