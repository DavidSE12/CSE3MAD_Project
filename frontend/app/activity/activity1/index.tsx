import { SafeAreaView } from "react-native-safe-area-context";
import InstructionScreen from "./instruction";

export default function Activity1() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <InstructionScreen />
    </SafeAreaView>
  );
}
