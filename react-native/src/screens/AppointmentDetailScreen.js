import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { usePrototypeFeedback } from '../components/PrototypeFeedback';
import { SafeAreaScreen } from '../components/SafeAreaScreen';
import { appointmentDetailDate } from '../utils/appointmentFormat';
import { scaledFontSize } from '../theme/tokens';
import { useClearViewTheme } from '../theme/useClearViewTheme';

export function AppointmentDetailScreen({ appointment, onBack }) {
  const { theme } = useClearViewTheme();
  const { showPrototypeFeedback } = usePrototypeFeedback();
  const location = appointment.locationDetail
    ? `${appointment.location} • ${appointment.locationDetail}`
    : appointment.location;

  return (
    <SafeAreaScreen style={{ backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Back to appointments"
            accessibilityRole="button"
            onPress={onBack}
            style={styles.back}
          >
            <Text
              style={[
                styles.backText,
                {
                  color: theme.colors.primary,
                  fontSize: scaledFontSize(34, theme),
                },
              ]}
            >
              ‹
            </Text>
          </Pressable>
          <Text
            accessibilityRole="header"
            style={[
              styles.headerTitle,
              { color: theme.colors.ink, fontSize: scaledFontSize(24, theme) },
            ]}
          >
            Appointment Details
          </Text>
        </View>
        <Text
          style={[
            styles.status,
            {
              color: theme.colors.mintInk,
              fontSize: scaledFontSize(14, theme),
            },
          ]}
        >
          {appointment.status}
        </Text>
        <Text
          style={[
            styles.title,
            { color: theme.colors.ink, fontSize: scaledFontSize(26, theme) },
          ]}
        >
          {appointment.specialty} visit
        </Text>
        <Text
          style={[
            styles.clinician,
            { color: theme.colors.ink, fontSize: scaledFontSize(18, theme) },
          ]}
        >
          {appointment.clinicianName}
        </Text>
        <Section
          label="Date & time"
          theme={theme}
          value={appointmentDetailDate(appointment.scheduledAt)}
        />
        <Section label="Location" theme={theme} value={location} />
        <Section
          label="Visit type"
          theme={theme}
          value={appointment.visitType}
        />
        <View
          style={[
            styles.notice,
            {
              backgroundColor: theme.colors.infoBackground,
              borderColor: theme.colors.infoBorder,
              borderWidth: theme.borderWidth,
            },
          ]}
        >
          <Text
            style={[
              styles.noticeTitle,
              {
                color: theme.colors.primary,
                fontSize: scaledFontSize(16, theme),
              },
            ]}
          >
            Before your visit
          </Text>
          <Text
            style={{
              color: theme.colors.ink,
              fontSize: scaledFontSize(16, theme),
            }}
          >
            {appointment.preparationNote}
          </Text>
        </View>
        <PrimaryButton
          label="Get directions"
          onPress={() =>
            showPrototypeFeedback(
              'Directions are not available in this prototype.',
            )
          }
        />
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            showPrototypeFeedback(
              'Rescheduling is not available in this prototype.',
            )
          }
          style={[
            styles.outline,
            {
              borderColor: theme.colors.primary,
              borderWidth: theme.borderWidth,
            },
          ]}
        >
          <Text
            style={[
              styles.outlineText,
              {
                color: theme.colors.primary,
                fontSize: scaledFontSize(16, theme),
              },
            ]}
          >
            Reschedule
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaScreen>
  );
}

function Section({ label, value, theme }) {
  return (
    <View
      style={[
        styles.section,
        {
          borderColor: theme.colors.border,
          borderBottomWidth: theme.borderWidth,
        },
      ]}
    >
      <Text
        style={[
          styles.sectionLabel,
          { color: theme.colors.mutedInk, fontSize: scaledFontSize(14, theme) },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.sectionValue,
          { color: theme.colors.ink, fontSize: scaledFontSize(16, theme) },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  content: {
    padding: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  back: {
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
  },
  headerTitle: {
    fontWeight: '700',
  },
  status: {
    fontWeight: '700',
  },
  title: {
    fontWeight: '700',
    marginTop: 16,
  },
  clinician: {
    fontWeight: '700',
    marginTop: 8,
  },
  section: {
    marginTop: 24,
    paddingBottom: 18,
  },
  sectionLabel: {
    fontWeight: '700',
  },
  sectionValue: {
    marginTop: 8,
  },
  notice: {
    borderRadius: 12,
    marginVertical: 24,
    padding: 14,
  },
  noticeTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  outline: {
    alignItems: 'center',
    borderRadius: 11,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 52,
  },
  outlineText: {
    fontWeight: '700',
  },
});
