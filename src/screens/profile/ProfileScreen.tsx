import { Redirect, router, type Href } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { COPY } from '@/constants/copy';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthSession } from '@/hooks/use-auth-session';
import { supabase } from '@/lib/supabase/client';
import type { ThemePreference } from '@/store/slices/types';
import type { AppColors } from '@/theme/colors';
import { fontFamily } from '@/theme/fonts';
import { tokens } from '@/theme/tokens';

const APPEARANCE_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: COPY.profile.themeLight },
  { value: 'dark', label: COPY.profile.themeDark },
  { value: 'system', label: COPY.profile.themeSystem },
];

export default function ProfileScreen() {
  const { colors, preference, setPreference } = useAppTheme();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const session = useAuthSession();
  const [signingOut, setSigningOut] = useState(false);

  if (session === undefined) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href={'/login' as Href} />;
  }

  const isGuest = session.user.is_anonymous === true;
  const email = isGuest ? COPY.profile.guestSession : (session.user.email ?? session.user.id);

  const onSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    router.replace('/login' as Href);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollInner,
        {
          paddingTop: tokens.space.lg,
          paddingHorizontal: tokens.space.xl,
          paddingBottom: insets.bottom + tokens.space.xl,
        },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionLabel}>{COPY.profile.appearanceLabel}</Text>
      <Text style={styles.sectionHint} selectable>
        {COPY.profile.appearanceHint}
      </Text>
      <View style={styles.segmentRow}>
        {APPEARANCE_OPTIONS.map(({ value, label }) => {
          const selected = preference === value;
          return (
            <Pressable
              key={value}
              onPress={() => setPreference(value)}
              style={({ pressed }) => [
                styles.segment,
                selected && styles.segmentSelected,
                pressed && styles.segmentPressed,
              ]}
            >
              <Text style={[styles.segmentLabel, selected && styles.segmentLabelSelected]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.sectionLabel, styles.accountHeading]}>{COPY.profile.signedInAs}</Text>
      <Text style={styles.email} selectable>
        {email}
      </Text>
      <AppButton
        variant="primary"
        onPress={() => onSignOut()}
        loading={signingOut}
        style={styles.signOutButton}
      >
        {COPY.profile.signOut}
      </AppButton>
    </ScrollView>
  );
}

function createStyles(c: AppColors) {
  return StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background },
    scroll: { flex: 1, backgroundColor: c.background },
    scrollInner: { flexGrow: 1 },
    sectionLabel: {
      fontSize: 12,
      color: c.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontFamily: fontFamily.bodySemiBold,
    },
    sectionHint: {
      marginTop: 6,
      fontSize: 14,
      color: c.textSecondary,
      fontFamily: fontFamily.body,
      lineHeight: 20,
    },
    segmentRow: {
      flexDirection: 'row',
      marginTop: 14,
      gap: 8,
    },
    segment: {
      flex: 1,
      paddingVertical: 11,
      paddingHorizontal: 8,
      borderRadius: tokens.radius.md,
      backgroundColor: c.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      alignItems: 'center',
    },
    segmentSelected: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    segmentPressed: { opacity: 0.88 },
    segmentLabel: {
      fontSize: 14,
      color: c.text,
      fontFamily: fontFamily.bodySemiBold,
    },
    segmentLabelSelected: {
      color: c.onPrimary,
    },
    accountHeading: { marginTop: 32 },
    email: { marginTop: 8, fontSize: 17, color: c.text, fontFamily: fontFamily.displayMedium },
    signOutButton: {
      marginTop: 28,
      paddingVertical: tokens.space.md2,
      borderRadius: tokens.radius.button,
    },
  });
}
