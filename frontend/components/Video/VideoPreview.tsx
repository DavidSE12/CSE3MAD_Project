import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { Button, StyleSheet, View } from "react-native";

interface VideoPreviewProps {
  videoUri: string;
  onRetake: () => void;
  onProceed: () => void;
}

export default function VideoPreview({
  videoUri,
  onRetake,
  onProceed,
}: VideoPreviewProps) {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.play();
  });
  const isPlaying = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  return (
    <View style={styles.container}>
      <VideoView
        style={styles.fullPreview}
        player={player}
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture
      />
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
