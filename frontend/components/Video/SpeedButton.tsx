import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SpeedButtonProps {
  speed: number;
  onChange: (speed: number) => void;
}

export default function SpeedButton({ speed, onChange }: SpeedButtonProps) {
  return (
    <TouchableOpacity
      style={styles.speedButton}
      onPress={() => onChange(speed)}
    >
      <Text>{speed}x</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  speedButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
});
