import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';
import useRouter from 'expo-router';

export type ActivityLevel = 'easy' | 'medium' | 'hard';


interface ActivityCardProps {
  id: string;
  logo?: string; // Image URI/URL
  level?: ActivityLevel;
  activityName?: string;
  description?: string;
  onPress?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  id = "1",
  logo,
  level = 'medium',
  activityName = 'Activity Name',
  description = 'Short description of the activity goes here',
  onPress,
}) => {
  // Get level color based on difficulty
  const getLevelColor = () => {
    switch (level) {
      case 'easy':
        return styles.levelEasy;
      case 'hard':
        return styles.levelHard;
      case 'medium':
      default:
        return styles.levelMedium;
    }
  };

  const getLevelTextColor = () => {
    switch (level) {
      case 'easy':
        return { color: '#27AE60' };
      case 'hard':
        return { color: '#E74C3C' };
      case 'medium':
      default:
        return { color: '#F39C12' };
    }
  };

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.container,
      pressed && styles.pressed,
    ]}>
      <View style={styles.innerContainer}>
        {/* Left Section: Logo */}
        <View style={styles.logoContainer}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>🖼️</Text>
            </View>
          )}
        </View>

        {/* Middle Section: Content */}
        <View style={styles.contentContainer}>
          {/* Level Badge */}
          <View style={[styles.levelBadge, getLevelColor()]}>
            <Text style={[styles.levelText, getLevelTextColor()]}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </View>

          {/* Activity Name */}
          <Text style={styles.activityName} numberOfLines={1}>
            {activityName}
          </Text>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        </View>

        {/* Right Section: Arrow */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    marginBottom: spacing.md,
    width: 280,
    ...shadows.light,
  },
  pressed: {
    opacity: 0.7,
  },
  innerContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 120,
  },
  logoContainer: {
    marginRight: spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    fontSize: 32,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  levelEasy: {
    backgroundColor: '#D5F4E6',
  },
  levelMedium: {
    backgroundColor: '#FADBD8',
  },
  levelHard: {
    backgroundColor: '#FADBD8',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activityName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  arrow: {
    fontSize: 28,
    color: colors.accent,
    fontWeight: 'bold',
  },
});

export default ActivityCard;
