import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";

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
    <View>
      <CameraView facing={facing}>
        <TouchableOpacity onPress={toggleCameraFunction}>
          <Text>Flip camera</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}
