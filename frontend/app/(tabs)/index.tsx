import Instruction from "@/components/Instruction";
import { router } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

interface Activity {
  id: string;
  title?: string;
  description?: string;
  timestamp?: string;
  // Add more fields as needed
}

interface ChallengeCard {
  id: string;
  title?: string;
  description?: string;
  timestamp?: string;
  // Add more fields as needed
}

/**
 * Renders Challenge Cards in a horizontal scrollable view
 * @param cards - Array of challenge card data
 */
const renderChallengeCards = (cards: ChallengeCard[] = []) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Active Challenges</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={280}
        decelerationRate="fast"
        style={styles.horizontalScroll}
      >
        {cards.length > 0 ? (
          cards.map((card) => (
            <View key={card.id} style={styles.challengeCard}>
              <Text style={styles.cardPlaceholder}>
                Challenge Card{'\n'}(ID: {card.id})
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>No challenges yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

/**
 * Renders Activities List in a horizontal scrollable view
 * @param activities - Array of activity card data
 */
const renderActivities = (activities: Activity[] = []) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Activities List</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={300}
        decelerationRate="fast"
        style={styles.horizontalScroll}
      >
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              id={activity.id}
              activityName={activity.title || 'Activity'}
              description={activity.description || 'No description'}
              onPress={() => {
                // Handle activity card press - navigate or show details
                console.log('Activity pressed:', activity.id);
              }}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>No activities yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default function HomeScreen() {
  // Sample challenge cards data (replace with real data)
  const challengeCards: ChallengeCard[] = [];

  // Sample activities data (replace with real data)
  const activities: Activity[] = [
    {
      id: '1',
      title: 'Parachute Drop Challenge',
      description: 'Design and test parachutes to reduce landing speed and impact force. Teams iterate designs to achieve the slowest, safest landing.',
      timestamp: '2024-04-05',
    },
    {
      id: '2',
      title: 'Sound Pollution Hunter',
      description: 'Measure and compare sound levels from different classroom activities. Map loud and quiet zones to understand sound pollution.',
      timestamp: '2024-04-06',
    },
    {
      id: '3',
      title: 'Hand Fan Challenge',
      description: 'Test how air movement affects flexible materials. Design different fans and observe how paper bends at various distances.',
      timestamp: '2024-04-07',
    },
    {
      id: '4',
      title: 'Earthquake-Resistant Structure',
      description: 'Build structures that withstand vibration simulating earthquakes. Design anti-vibration layers to reduce phone movement.',
      timestamp: '2024-04-08',
    },
    {
      id: '5',
      title: 'Human Performance Lab',
      description: 'Investigate body movement by measuring speed, smoothness, and coordination during controlled stretching activities using phone sensors.',
      timestamp: '2024-04-09',
    },
    {
      id: '6',
      title: 'Reaction Board Challenge',
      description: 'Measure reaction time, coordination, and improvement through digital and physical challenges. Test with dominant and non-dominant hands.',
      timestamp: '2024-04-10',
    },
    {
      id: '7',
      title: 'Breathing Pace Trainer',
      description: 'Analyze breathing patterns at rest and after exercise. Place phone on chest to record breathing before and after physical activities.',
      timestamp: '2024-04-11',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Custom Header Component */}
      <Header/>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Team Info Card with Dummy Data */}
        <TeamInfoCard
          teamName="Team Rockets"
          members={['Alice', 'Bob', 'Charlie']}
          grade="Year 7"
          points={450}
          rank={12}
        />

        {/* Challenge Cards Section */}
        {renderChallengeCards(challengeCards)}

        {/* Activities List Section */}
        {renderActivities(activities)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.lg,
  },
  sectionContainer: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
  },
  horizontalScroll: {
    paddingHorizontal: spacing.md,
  },
  challengeCard: {
    width: 280,
    height: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginRight: spacing.md,
    ...shadows.light,
  },
  cardPlaceholder: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  emptyCard: {
    width: 280,
    height: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.light,
  },
  emptyCardText: {
    fontSize: 14,
    color: colors.textSecondary,
  },

});
