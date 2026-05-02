import Header from "@/src/components/header";
import TeamInfoCard from "@/src/components/TeamInfoCard";
import ChatBox from "@/src/components/ChatBox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getUserProfile, getTeam, getTeamMembers } from '../../services/firestore';
import { getAuth } from 'firebase/auth';


// ─── Kiểu dữ liệu ─────────────────────────────────────────────────────────────

interface Activity {
  id: string;
  title: string;
  description: string;
  nextScreen: string;
  icon: string;      // tên icon từ MaterialCommunityIcons
  iconColor: string; // màu icon
  iconBg: string;    // màu nền vòng tròn icon
}

// ─── Dữ liệu hoạt động ────────────────────────────────────────────────────────

// 4 cái đầu → nhóm Engineering Challenges
// 3 cái cuối → nhóm Health & Medical Science
const activities: Activity[] = [
  {
    id: "1",
    title: "Parachute Drop",
    description:
      "Design and test parachutes to reduce landing speed and impact force.",
    nextScreen: "parachute/InstructionScreen",
    icon: "parachute",
    iconColor: "#3977fd",
    iconBg: "#DBEAFE",
  },
  {
    id: "2",
    title: "Sound Pollution Hunter",
    description: "Measure and compare sound levels. Map loud and quiet zones.",
    nextScreen: "soundPollutionHunter/InstructionScreen",
    icon: "volume-high",
    iconColor: "#7C3AED",
    iconBg: "#EDE9FE",
  },
  {
    id: "3",
    title: "Hand Fan Challenge",
    description:
      "Test how air movement affects flexible materials with fan designs.",
    nextScreen: "handFanChallenge/InstructionScreen",
    icon: "fan",
    iconColor: "#0891B2",
    iconBg: "#CFFAFE",
  },
  {
    id: "4",
    title: "Earthquake Structure",
    description:
      "Build structures that withstand vibrations simulating earthquakes.",
    nextScreen: "earthquake/InstructionScreen",
    icon: "home-alert",
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
  },
  {
    id: "5",
    title: "Performance Lab",
    description:
      "Measure speed, smoothness, and coordination during stretching.",
    nextScreen: "humanPerformanceLab/InstructionScreen",
    icon: "run-fast",
    iconColor: "#059669",
    iconBg: "#D1FAE5",
  },
  {
    id: "6",
    title: "Reaction Board",
    description:
      "Test reaction time and coordination with dominant and non-dominant hands.",
    nextScreen: "reactionBoardChallenge/InstructionScreen",
    icon: "lightning-bolt",
    iconColor: "#DC2626",
    iconBg: "#FEE2E2",
  },
  {
    id: "7",
    title: "Breathing Pace Trainer",
    description:
      "Analyse breathing patterns at rest and after exercise using phone sensors. Place phone on chest to record before and after physical activities.",
    nextScreen: "breathingPaceTrainer/InstructionScreen",
    icon: "lungs",
    iconColor: "#0284C7",
    iconBg: "#E0F2FE",
  },
];

// ─── Component thẻ lưới ───────────────────────────────────────────────────────

// Chiều cao cố định của thẻ vuông — dùng để căn chỉnh thẻ cao (activity 7)
const CARD_H = 160;
const GAP = 12;

interface GridCardProps {
  activity: Activity;
}

/**
 * GridCard — thẻ có thể nhấn dùng trong lưới hoạt động.
 * Hiển thị vòng tròn icon màu, tiêu đề và mô tả rút gọn.
 */
const GridCard: React.FC<GridCardProps> = ({ activity }) => {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [
        gs.card,
        { height: CARD_H },
        pressed && { opacity: 0.75 },
      ]}
      onPress={() => router.navigate(`./screens/${activity.nextScreen}`)}
    >
      {/* Vòng tròn icon màu */}
      <View style={[gs.iconCircle, { backgroundColor: activity.iconBg }]}>
        <MaterialCommunityIcons
          name={activity.icon as any}
          size={24}
          color={activity.iconColor}
        />
      </View>

      {/* Tiêu đề hoạt động */}
      <Text style={gs.cardTitle} numberOfLines={2}>
        {activity.title}
      </Text>

      {/* Mô tả rút gọn */}
      <Text style={gs.cardDesc} numberOfLines={2}>
        {activity.description}
      </Text>

      {/* Mũi tên góc dưới phải */}
      <View style={gs.arrowRow}>
        <MaterialCommunityIcons name="arrow-right" size={16} color="#9CA3AF" />
      </View>
    </Pressable>
  );
};



// ─── Màn hình chính ───────────────────────────────────────────────────────────

/**
 * HomeScreen — màn hình chính gồm hai nhóm hoạt động:
 *   1. Engineering Challenges  (hoạt động 1–4) — lưới 2 × 2
 *   2. Health & Medical Science (hoạt động 5–7) — 2 thẻ ngang + 1 thẻ cao toàn chiều rộng
 */
const CHAT_HEIGHT = 480;

export default function HomeScreen() {
  const engineering = activities.slice(0, 4);
  const health = activities.slice(4, 6);
  const healthTall = activities[6];

  const [userName, setUserName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [grade, setGrade] = useState('');

  const [chatOpen, setChatOpen] = useState(false);

  // chatHeight tự động thu nhỏ trên màn hình nhỏ khi bàn phím chiếm quá nhiều chỗ
  const [chatHeight, setChatHeight] = useState(CHAT_HEIGHT);

  // slideAnim: 0 = panel hiện ở đáy màn hình, CHAT_HEIGHT = panel ẩn bên dưới màn hình
  const slideAnim = useRef(new Animated.Value(CHAT_HEIGHT)).current;

  // keyboardAnim: 0 = không có bàn phím, -keyboardHeight = panel được đẩy lên trên bàn phím
  // Dùng số âm vì translateY âm = di chuyển lên trên
  const keyboardAnim = useRef(new Animated.Value(0)).current;

  // Gộp hai animation thành một translateY duy nhất — cùng dùng useNativeDriver:true, không lỗi
  // Khi đóng:        CHAT_HEIGHT + 0               = CHAT_HEIGHT  (ẩn dưới màn hình)
  // Khi mở:          0 + 0                         = 0            (nằm ở đáy màn hình)
  // Khi có bàn phím: 0 + (-keyboardHeight)         = -keyboardHeight (trượt lên trên bàn phím)
  const combinedAnim = Animated.add(slideAnim, keyboardAnim);

  useEffect(() => {
    // iOS bắn sự kiện `Will` TRƯỚC khi bàn phím hiện → panel di chuyển đồng bộ với bàn phím.
    // Android chỉ có sự kiện `Did` (bắn SAU khi bàn phím đã hiện) → có thể bị giật nhẹ.
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const screenH = Dimensions.get('window').height;

      // Giới hạn chatHeight để panel không tràn lên trên màn hình trên thiết bị nhỏ.
      // Ví dụ iPhone SE (màn 667px, bàn phím 291px): available = 667 - 291 - 20 = 356px
      const available = screenH - e.endCoordinates.height - 20;
      setChatHeight(Math.min(CHAT_HEIGHT, available));

      // Đẩy panel lên bằng translateY âm — dùng useNativeDriver:true, không lỗi 'bottom'
      Animated.timing(keyboardAnim, {
        toValue: -208,
        duration: e.duration ?? 250,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      // Khôi phục chiều cao và hạ panel về đáy màn hình khi bàn phím đóng.
      setChatHeight(CHAT_HEIGHT);

      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: e.duration ?? 250,
        useNativeDriver: true,
      }).start();
    });

    return () => { showSub.remove(); hideSub.remove(); };
  }, [keyboardAnim]);

  const openChat = () => {
    setChatOpen(true);
    // Trượt panel từ ngoài màn hình lên (translateY: CHAT_HEIGHT → 0)
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 6,
    }).start();
  };

  const closeChat = () => {
    // Trượt panel xuống rồi unmount để giải phóng bộ nhớ
    Animated.timing(slideAnim, {
      toValue: CHAT_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setChatOpen(false));
  };

  useEffect(() => {
    const load = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const profileSnap = await getUserProfile(user.uid);
      if (!profileSnap.exists()) return;

      const profile = profileSnap.data();
      setUserName(profile.name);
      setGrade(`Year ${profile.grade}`);

      if (profile.teamId) {
        setTeamId(profile.teamId);

        const [teamSnap, teamMembers] = await Promise.all([
          getTeam(profile.teamId),
          getTeamMembers(profile.teamId),
        ]);

        if (teamSnap.exists()) setTeamName(teamSnap.data().name);
        setMemberNames(teamMembers.map((m: any) => m.name));
      }
    };

    load();
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container}>
        <Header userName={userName} />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <TeamInfoCard
            teamName={teamName}
            teamId={teamId}
            members={memberNames}
            grade={grade}
            points={450}
            rank={12}
          />

          {/* ── Nhóm 1: Engineering Challenges ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Engineering Challenges</Text>

            {/* Hàng 1: hoạt động 1 & 2 */}
            <View style={styles.gridRow}>
              <GridCard activity={engineering[0]} />
              <GridCard activity={engineering[1]} />
            </View>

            {/* Hàng 2: hoạt động 3 & 4 */}
            <View style={styles.gridRow}>
              <GridCard activity={engineering[2]} />
              <GridCard activity={engineering[3]} />
            </View>
          </View>

          {/* ── Nhóm 2: Health & Medical Science ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health & Medical Science</Text>

            {/* Hàng 1: hoạt động 5 & 6 nằm ngang */}
            <View style={styles.gridRow}>
              <GridCard activity={health[0]} />
              <GridCard activity={health[1]} />
            </View>

            {/* Hàng 2: hoạt động 7 chiếm toàn chiều rộng */}
            <GridCard activity={healthTall} />
          </View>
        </ScrollView>

        {/* ── Nút chat nổi — ẩn khi chat đang mở ── */}
        {!chatOpen && (
          <Pressable
            style={({ pressed }) => [styles.fab, pressed && { opacity: 0.8 }]}
            onPress={openChat}
          >
            <MaterialCommunityIcons name="chat" size={24} color="#fff" />
          </Pressable>
        )}
      </SafeAreaView>

      {/*
        ── Panel chat trượt lên ──
        Đặt NGOÀI SafeAreaView là có chủ đích:
          • Bên trong SafeAreaView, bottom:0 = phía trên vùng home-indicator (~34px trên đáy vật lý)
          • Bên ngoài SafeAreaView, bottom:0 = đáy vật lý màn hình = cùng tham chiếu với e.endCoordinates.height
          • Nhờ vậy, đặt bottom = chiều cao bàn phím → panel khớp sát bàn phím, không có khoảng trống.

        Một Animated.View duy nhất với combinedAnim = slideAnim + keyboardAnim:
          • slideAnim:    CHAT_HEIGHT → 0  (mở/đóng panel)
          • keyboardAnim: 0 → -keyboardHeight  (đẩy lên trên bàn phím)
          • Cả hai cùng useNativeDriver:true → không lỗi 'bottom not supported'
      */}
      {chatOpen && (
        <Animated.View
          style={[styles.chatPanel, { transform: [{ translateY: combinedAnim }] }]}
        >
          {/* Thanh tiêu đề panel */}
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderLeft}>
              <View style={styles.chatAvatar}>
                <Text style={styles.chatAvatarText}>AI</Text>
              </View>
              <View>
                <Text style={styles.chatHeaderName}>STEM Tutor</Text>
                <Text style={styles.chatHeaderSub}>Powered by GPT-4</Text>
              </View>
            </View>
            <Pressable
              onPress={closeChat}
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
            >
              <MaterialCommunityIcons name="chevron-down" size={22} color="#6B7280" />
            </Pressable>
          </View>

          {/* Nội dung chat */}
          <ChatBox height={chatHeight - 80} />
        </Animated.View>
      )}
    </View>
  );
}

// ─── Style thẻ lưới ───────────────────────────────────────────────────────────

const gs = StyleSheet.create({
  // Khung thẻ — flex:1 để hai thẻ trong một hàng chia đều chiều rộng
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  // Vòng tròn nền icon
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  // Tiêu đề thẻ — đậm, tối đa 2 dòng
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
    lineHeight: 18,
  },

  // Mô tả thẻ — màu nhạt, chữ nhỏ
  cardDesc: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 15,
    flex: 1,
  },

  // Mũi tên ghim góc dưới phải
  arrowRow: {
    alignItems: "flex-end",
    marginTop: 6,
  },
});

// ─── Style màn hình chính ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F4EF",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: GAP,
    marginBottom: GAP,
  },

  // Nút chat nổi góc phải bên dưới
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3977fd',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3977fd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },

  // Panel chat — nằm cố định ở đáy màn hình, translateY điều khiển vị trí
  chatPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 7,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
  },

  // Messenger-style panel header
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#3977fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  chatHeaderName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  chatHeaderSub: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  closeBtn: {
    padding: 4,
  },
});
