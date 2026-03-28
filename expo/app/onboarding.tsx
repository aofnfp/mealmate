import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusFlow } from '@/store/focusflow-context';
import { storage } from '@/lib/storage';
import { TowerType } from '@/types/index';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { 
  Briefcase, 
  Heart, 
  BookOpen, 
  Palette, 
  Users, 
  User,
  ChevronRight,
  Clock,
  Target,
  Building2
} from 'lucide-react-native';



const TOWER_OPTIONS = [
  { id: 'career' as TowerType, icon: Briefcase, title: 'Career', description: 'Advance your professional goals', color: '#007AFF' },
  { id: 'health' as TowerType, icon: Heart, title: 'Health', description: 'Build strength and wellness', color: '#34C759' },
  { id: 'learning' as TowerType, icon: BookOpen, title: 'Learning', description: 'Expand your knowledge', color: '#FF9500' },
  { id: 'creativity' as TowerType, icon: Palette, title: 'Creativity', description: 'Express your artistic side', color: '#AF52DE' },
  { id: 'relationships' as TowerType, icon: Users, title: 'Relationships', description: 'Strengthen connections', color: '#FF3B30' },
  { id: 'personal' as TowerType, icon: User, title: 'Personal', description: 'Develop inner peace', color: '#5AC8FA' },
];

const DURATION_OPTIONS = [
  { duration: 600, label: 'Quick Start', subtitle: '10 minutes' },
  { duration: 1500, label: 'Power Session', subtitle: '25 minutes' },
  { duration: 2700, label: 'Deep Work', subtitle: '45 minutes' },
  { duration: 5400, label: 'Marathon', subtitle: '90 minutes' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setSelectedTower, startSession } = useFocusFlow();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTowerType, setSelectedTowerType] = useState<TowerType | null>(null);
  const [intention, setIntention] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1500);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (selectedTowerType) {
      setSelectedTower(selectedTowerType);
      await storage.setOnboardingComplete();
      // Start the first session
      await startSession(
        selectedTowerType,
        selectedDuration,
        intention || `Building my ${selectedTowerType} tower`
      );
      router.replace('/(tabs)');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.hero}>
              <Building2 size={80} color={colors.primary} style={styles.mainIcon} />
              <Text style={styles.title}>Welcome to FocusFlow</Text>
              <Text style={typography.subtitle}>Build your dream life, one focused moment at a time</Text>
            </View>
            <TouchableOpacity style={styles.cta} onPress={handleNext}>
              <Text style={styles.ctaText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Choose Your First Focus Area</Text>
            <Text style={styles.subtitle}>What area of your life do you want to develop?</Text>
            <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
              {TOWER_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedTowerType === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isSelected && { borderColor: option.color, borderWidth: 2 }
                    ]}
                    onPress={() => setSelectedTowerType(option.id)}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                      <Icon size={24} color={option.color} />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                    {isSelected && (
                      <View style={[styles.checkmark, { backgroundColor: option.color }]}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.primaryButton, !selectedTowerType && styles.disabledButton]} 
                onPress={handleNext}
                disabled={!selectedTowerType}
              >
                <Text style={styles.primaryButtonText}>Continue</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Target size={60} color="#007AFF" style={styles.mainIcon} />
            <Text style={styles.title}>Set Your Intention</Text>
            <Text style={styles.subtitle}>What specific goal are you working toward?</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>My intention for today:</Text>
              <TouchableOpacity
                style={styles.textInput}
                onPress={() => {
                  // In a real app, this would open a text input modal
                  setIntention('Focus on my goals');
                }}
              >
                <Text style={[styles.textInputText, !intention && styles.placeholderText]}>
                  {intention || 'Tap to enter your intention...'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                <Text style={styles.primaryButtonText}>Continue</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Clock size={60} color="#007AFF" style={styles.mainIcon} />
            <Text style={styles.title}>Choose Your Focus Duration</Text>
            <Text style={styles.subtitle}>How long can you focus right now?</Text>
            <View style={styles.durationContainer}>
              {DURATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.duration}
                  style={[
                    styles.durationCard,
                    selectedDuration === option.duration && styles.selectedDuration
                  ]}
                  onPress={() => setSelectedDuration(option.duration)}
                >
                  <Text style={[
                    styles.durationLabel,
                    selectedDuration === option.duration && styles.selectedDurationText
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.durationSubtitle,
                    selectedDuration === option.duration && styles.selectedDurationText
                  ]}>
                    {option.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
                <Text style={styles.primaryButtonText}>Start Building</Text>
                <Building2 size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        {[0, 1, 2, 3].map((step) => (
          <View
            key={step}
            style={[
              styles.progressDot,
              step === currentStep && styles.progressDotActive,
              step < currentStep && styles.progressDotComplete
            ]}
          />
        ))}
      </View>
      {renderStep()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  progressDotActive: {
    width: 24,
    backgroundColor: '#007AFF',
  },
  progressDotComplete: {
    backgroundColor: '#34C759',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  mainIcon: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  hero: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  cta: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
  },
  ctaText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  optionsContainer: {
    maxHeight: 400,
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInputText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  durationContainer: {
    marginBottom: 32,
  },
  durationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedDuration: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  durationLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  durationSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  selectedDurationText: {
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.5,
  },
});