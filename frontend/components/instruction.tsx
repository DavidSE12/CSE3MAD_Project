import { FlatList, Image, Text, View } from "react-native";

interface InstructionProps {
  instruction: string;
  tools: string[];
  diagramImage: string; // url
  formulas: string[];
}

export default function Instruction({
  instruction,
  tools,
  diagramImage,
  formulas,
}: InstructionProps) {
  return (
    <View>
      <View>
        <Text>Instruction</Text>
        <Text>{instruction}</Text>
        <Image source={{ uri: diagramImage }} />
      </View>

      <View>
        <Text>Tools</Text>
        <FlatList
          data={tools}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item}</Text>
            </View>
          )}
        />
      </View>

      <View>
        <Text>Formulas</Text>
        <FlatList
          data={formulas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
