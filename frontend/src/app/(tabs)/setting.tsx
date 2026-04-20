import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * SettingScreen — displays app settings and account options.
 * Currently provides a sign-out action that clears the Firebase
 * session and redirects the user back to the login screen.
 */
export default function SettingScreen() {
  const router = useRouter();

  // loading: true while the sign-out request is in flight (disables button to prevent double-tap)
  const [loading, setLoading] = useState(false);

  /**
   * handleLogout — signs the user out of Firebase Auth.
   * Shows a confirmation alert first, then calls signOut().
   * On success the _layout auth guard redirects to /login automatically.
   */
  const handleLogout = () => {
    // Ask the user to confirm before signing out
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // Sign out from Firebase — triggers onAuthStateChanged(null) in _layout
              await signOut(getAuth());
              // _layout's auth guard will automatically redirect to /login
              router.replace('/login');
            } catch {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={s.screen}>

      {/* ── Page title ── */}
      <Text style={s.pageTitle}>Settings</Text>

      {/* ── Account section ── */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Account</Text>

        {/* Sign out row */}
        <Pressable
          style={({ pressed }) => [s.row, pressed && { opacity: 0.7 }]}
          onPress={handleLogout}
          disabled={loading}
        >
          {/* Red icon to signal a destructive action */}
          <View style={s.iconBox}>
            <MaterialCommunityIcons name="logout" size={20} color="#E74C3C" />
          </View>

          <Text style={s.rowLabel}>Sign Out</Text>

          {/* Show spinner while sign-out is in progress */}
          {loading
            ? <ActivityIndicator size="small" color="#9CA3AF" />
            : <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
          }
        </Pressable>
      </View>

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // Full-screen background
  screen: {
    flex: 1,
    backgroundColor: '#F8F4EF',
    padding: 20,
  },

  // Top-level heading
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 28,
  },

  // Card-like container grouping related rows
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  // Label above the section card
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 8,
  },

  // Single tappable setting row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  // Coloured circle behind the row icon
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FDECEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  // Row label text
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#E74C3C',
  },
});
