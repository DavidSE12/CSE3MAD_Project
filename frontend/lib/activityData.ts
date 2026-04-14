export interface ActivityData {
  id: string;
//   image: any;  // Image require() or URL string
  title: string;
  description: string;
  instructions: string;
  materials?: string[];
  nextScreen: string;
  timestamp: string;
}

export const ACTIVITIES: Record<string, ActivityData> = {
  "1": {
    id: "1",
    // image: require("./assets/images/chuotdeadline.jpg"),  // Local image
    title: "Parachute Drop Challenge",
    description: "Design and test parachutes to reduce landing speed and impact force. Teams iterate designs to achieve the slowest, safest landing.",
    instructions: "1. Design your parachute\n2. Test it\n3. Record results",
    materials: ["Paper", "String", "Weight"],
    nextScreen: "InstructionScreen",
    timestamp: "2024-04-05",
  },
  "2": {
    id: "2",
    // image: require("@/assets/images/sound.png"),
    title: "Sound Pollution Hunter",
    description: "Measure and compare sound levels from different classroom activities. Map loud and quiet zones to understand sound pollution.",
    instructions: "1. Open sound meter\n2. Measure noise levels\n3. Map sound zones",
    materials: ["Phone", "Meter app"],
    nextScreen: "record-sound",
    timestamp: "2024-04-06",
  },
  "3": {
    id: "3",
    // image: require("@/assets/images/fan.png"),
    title: "Hand Fan Challenge",
    description: "Test how air movement affects flexible materials. Design different fans and observe how paper bends at various distances.",
    instructions: "1. Set up fan\n2. Place paper\n3. Measure bend distance",
    materials: ["Fan", "Paper", "Ruler"],
    nextScreen: "record-video-fan",
    timestamp: "2024-04-07",
  },
  "4": {
    id: "4",
    // image: require("@/assets/images/earthquake.png"),
    title: "Earthquake-Resistant Structure",
    description: "Build structures that withstand vibration simulating earthquakes. Design anti-vibration layers to reduce phone movement.",
    instructions: "1. Build structure\n2. Test on vibration plate\n3. Measure phone movement",
    materials: ["Blocks", "Phone", "Vibration plate"],
    nextScreen: "record-video-earthquake",
    timestamp: "2024-04-08",
  },
  "5": {
    id: "5",
    // image: require("@/assets/images/human-performance.png"),
    title: "Human Performance Lab",
    description: "Investigate body movement by measuring speed, smoothness, and coordination during controlled stretching activities using phone sensors.",
    instructions: "1. Place phone on chest\n2. Perform stretches\n3. Record data",
    materials: ["Phone", "Sensor app"],
    nextScreen: "record-video-human",
    timestamp: "2024-04-09",
  },
  "6": {
    id: "6",
    // image: require("@/assets/images/reaction-board.png"),
    title: "Reaction Board Challenge",
    description: "Measure reaction time, coordination, and improvement through digital and physical challenges. Test with dominant and non-dominant hands.",
    instructions: "1. Load app\n2. Test reaction\n3. Try both hands",
    materials: ["Phone", "Reaction app"],
    nextScreen: "record-video-reaction",
    timestamp: "2024-04-10",
  },
  "7": {
    id: "7",
    // image: require("@/assets/images/breathing.png"),
    title: "Breathing Pace Trainer",
    description: "Analyze breathing patterns at rest and after exercise. Place phone on chest to record breathing before and after physical activities.",
    instructions: "1. Relax\n2. Place phone on chest\n3. Record breathing",
    materials: ["Phone", "App"],
    nextScreen: "record-video-breathing",
    timestamp: "2024-04-11",
  },
};

export const getActivity = (id: string) => ACTIVITIES[id];