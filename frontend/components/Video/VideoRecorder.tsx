// import { CameraType } from "expo-camera";
// import { useEffect, useRef, useState } from "react";
// import { Button, StyleSheet, Text, View } from "react-native";
// import { Camera, useCameraDevice } from "react-native-vision-camera";

// export default function VideoRecorder() {
//   const [permission, setPermission] = useState(false);

//   useEffect(() => {
//     const request = async () => {
//       const status = await Camera.requestCameraPermission();
//       setPermission(status === "granted");
//     };

//     request();
//   }, []);
//   const [facing, setFacing] = useState<CameraType>("back");
//   const [isRecording, setIsRecording] = useState(false);

//   const device = useCameraDevice(facing);
//   const camera = useRef<Camera>(null);

//   useEffect(() => {
//     const requestPermission = async () => {
//       const status = await Camera.requestCameraPermission();
//       setPermission(status === "granted");
//     };
//     requestPermission();
//   }, []);

//   if (device === null || device === undefined) return <Text>Camera not available</Text>;

//   if (!permission) {
//     return <Text>No camera permission</Text>;
//   }

//   const handleRecord = async () => {
//     if (!camera.current) return;

//     if (isRecording) {
//       camera.current.stopRecording();
//       setIsRecording(false);
//     } else {
//       setIsRecording(true);

//       camera.current.startRecording({
//         onRecordingFinished: (video) => {
//           console.log(video, "saved at:", video.path);
//           setIsRecording(false);
//         },
//         onRecordingError: (error) => {
//           (console.log(error), setIsRecording(false));
//         },
//       });
//     }
//   };

//   const handlePause = async () => {
//     if (camera.current !== null) {
//       camera.current.pauseRecording();
//     }
//   };

//   const handleResume = async () => {
//     if (camera.current !== null) {
//       camera.current.resumeRecording();
//     }
//   };

//   const handleCancel = async () => {
//     if (camera.current !== null) {
//       camera.current.cancelRecording();
//     }
//   };

//   const handleToggleCamera = () => {
//     setFacing((current) => (current === "back" ? "front" : "back"));
//   };

//   return (
//     <View>
//       <Camera
//         ref={camera}
//         style={styles.camera}
//         device={device}
//         isActive={true}
//         video={true}
//       />
//       <Button
//         title={isRecording ? "Stop Recording" : "Record"}
//         onPress={handleRecord}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   camera: {
//     flex: 1,
//   },
// });
