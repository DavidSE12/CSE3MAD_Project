import { useEvent } from "expo"; //?
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";
import { Button, StyleSheet, View} from "react-native";
import SpeedButton from "./SpeedButton";
import { GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';


interface VideoPreviewProps {
  videoUri: string;
  onRetake: () => void;
  onProceed: () => void;
}
const speedRates = [0.25, 0.5, 0.75, 1.0];


export default function VideoPreview({
  videoUri,
  onRetake,
  onProceed,
}: VideoPreviewProps) {

  const [currentSpeed, setCurrentSpeed] = useState(1.0);
  // Setup Video Player
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  const isPlaying = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const changeSpeed = (speed: number) => {
    player.playbackRate = speed;
    setCurrentSpeed(speed);
  };

  // Setup Zoom function
  // Zoom Value
  const [zoomLevel, setZoomLevel] = useState(1);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  // Pan Value
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);




  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
        // Allow zooming up to 10x (remove limit if you want unlimited)
        if (scale.value < 3) {
          scale.value = withSpring(1);
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
        if (scale.value > 12) {
          scale.value = withSpring(12);
        }
        savedScale.value = scale.value;
    })


 // Pan gesture for moving zoomed video
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Combine gestures
  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
  );

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));


  return (
    <View style={styles.container}>
      <GestureDetector gesture = {composedGesture}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <VideoView
        style={styles.fullPreview}
        player={player}
        fullscreenOptions={{ enable: false }}
        allowsPictureInPicture={false}
      />
        </Animated.View>
      </GestureDetector>

      <View style={styles.speedButtonsContainer}>
        {speedRates.map((speed: number) => (
          <SpeedButton
            speed={speed}
            onChange={() => changeSpeed(speed)}
            key={speed}
          />
        ))}
      </View>

      <View style={styles.previewControls}>
        <Button title="Discard & Retake" onPress={onRetake} />
        <Button title="Proceed" onPress={onProceed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
  },
  fullPreview: {
    flex: 1,
    backgroundColor: "#000",
  },
  speedButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    gap: 10,
  },
});
