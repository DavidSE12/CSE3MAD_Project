import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import SpeedButton from "./SpeedButton";

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

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.fullPreview}
        player={player}
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture
      />
      {speedRates.map((speed: number) => (
        <SpeedButton
          speed={speed}
          onChange={() => changeSpeed(speed)}
          key={speed}
        />
      ))}

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
  },
  fullPreview: {
    flex: 1,
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
