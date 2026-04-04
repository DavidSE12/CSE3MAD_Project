import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState } from "react";

interface SpeedButtonProps {
  speed: number;
  onChange: (speed: number) => void;
}

export default function SpeedButton({ speed, onChange }: SpeedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.speedButton, isPressed && styles.speedButtonActive]}
      onPress={() => onChange(speed)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.7}
    >
      <Text style={styles.speedText}>{speed}x</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  speedButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    minWidth: 50,
    alignItems: "center",
  },
  speedButtonActive: {
    backgroundColor: "rgba(100,200,255,0.6)",
    borderColor: "rgba(100,200,255,1)",
  },
  speedText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
