import { StyleSheet, Text, View } from "react-native";
import useBreathTracker from "../../hooks/useBreathTracker";

export default function BreathTracker() {
  const { bpm, x, y, z } = useBreathTracker();
  return (
    <View style={styles.container}>
      <Text style={styles.bpm}>{bpm}</Text>
      <Text style={styles.label}>breaths / min</Text>

      {/* Debug readout — remove in production */}
      <Text style={styles.debug}>
        x: {x.toFixed(3)} y: {y.toFixed(3)} z: {z.toFixed(3)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  bpm: { fontSize: 72, fontWeight: "200" },
  label: { fontSize: 16, opacity: 0.5, marginTop: 4 },
  debug: {
    fontSize: 11,
    opacity: 0.3,
    marginTop: 32,
    fontVariant: ["tabular-nums"],
  },
});
