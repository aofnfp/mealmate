import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Briefcase, Heart, BookOpen, Palette, Users, Sparkles, X, Search, Slash } from 'lucide-react-native';
import { useTheme } from '@/store/theme-context';

import { useFocusFlow } from '@/store/focusflow-context';
import { useRouter } from 'expo-router';
import TowerVisualization from '@/components/TowerVisualization';
import { logAllBuildingUrls } from '@/constants/buildings';
import { TowerType } from '@/types';

const TOWER_TABS = [
  { id: 'career', label: 'Career', icon: Briefcase },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'creativity', label: 'Creativity', icon: Palette },
  { id: 'relationships', label: 'Relationships', icon: Users },
  { id: 'personal', label: 'Personal', icon: Sparkles },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    currentSession,
    startSession,
    stopSession,
    totalEnergy,
    tags,
    selectedTagId,
    selectTag,
    towers,
  } = useFocusFlow();

  const [selectedTab] = useState('career');
  const [selectedDuration, setSelectedDuration] = useState(25); // minutes
  const [showTagModal, setShowTagModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');



  const progressAnim = useRef(new Animated.Value(0)).current;
  const buildingHeightAnim = useRef(new Animated.Value(160)).current; // Full height when complete
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [buildingState, setBuildingState] = useState<'preview' | 'foundation' | 'constructing' | 'completed'>('preview');

  const timeRemaining = currentSession?.remaining || null;
  const sessionProgress = currentSession?.isActive
    ? (currentSession.duration - (currentSession.remaining || 0)) / currentSession.duration
    : 0;

  // Debug: Log building URLs on mount
  useEffect(() => {
    logAllBuildingUrls();
  }, []);

  // Set building state based on session status
  useEffect(() => {
    if (!currentSession?.isActive) {
      setBuildingState('preview');
      // Show complete building when not in session
      Animated.timing(buildingHeightAnim, {
        toValue: 160,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else if (currentSession.isActive && buildingState === 'preview') {
      // Just started session, will be set to constructing by handleStartBuilding
    }
  }, [currentSession?.isActive, buildingHeightAnim, buildingState]);

  // Animate progress ring
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: sessionProgress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [sessionProgress, progressAnim]);

  // Animate building height based on session progress
  useEffect(() => {
    if (currentSession?.isActive && buildingState === 'constructing') {
      const targetHeight = 160 * sessionProgress; // Build from 0 to 160 based on progress
      Animated.timing(buildingHeightAnim, {
        toValue: targetHeight,
        duration: 500,
        useNativeDriver: false,
      }).start();

      // Check if completed
      if (sessionProgress >= 1) {
        setBuildingState('completed');
      }
    }
  }, [sessionProgress, currentSession?.isActive, buildingState, buildingHeightAnim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter tags based on search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags || [];
    return (tags || []).filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tags, searchQuery]);

  // Format tag time display
  const formatTagTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };



  const handleSelectTag = (tagId: string) => {
    selectTag(tagId);
    setShowTagModal(false);
    setSearchQuery('');
  };

  const getSelectedTagName = () => {
    if (!selectedTagId || !tags) return null;
    const tag = tags.find(t => t.id === selectedTagId);
    return tag?.name || null;
  };

  const handleStartBuilding = () => {
    if (currentSession?.isActive) {
      // Show give up confirmation
      setShowGiveUpModal(true);
    } else {
      // Animate building breakdown to foundation, then start session
      animateToFoundation(() => {
        const tagName = getSelectedTagName() || activeTab?.label || 'Building';
        startSession(selectedTab, selectedDuration * 60, tagName);
        setBuildingState('constructing');
      });
    }
  };

  const animateToFoundation = (callback: () => void) => {
    setBuildingState('foundation');
    // Animate the building breaking down to foundation (height goes to 0)
    Animated.timing(buildingHeightAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: false,
    }).start(() => {
      callback();
    });
  };

  const handleGiveUp = () => {
    setShowGiveUpModal(false);
    // Trigger collapse animation
    animateCollapse(() => {
      stopSession();
      // Reset to preview state after give up
      setTimeout(() => {
        setBuildingState('preview');
      }, 500);
    });
  };

  const animateCollapse = (callback: () => void) => {
    setBuildingState('foundation');
    // Animate the building collapse (height goes to 0, then back to full preview)
    Animated.timing(buildingHeightAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      callback();
      // After stopping session, animate back to full building
      setTimeout(() => {
        Animated.timing(buildingHeightAnim, {
          toValue: 160,
          duration: 600,
          useNativeDriver: false,
        }).start();
      }, 100);
    });
  };


  const displayTime = timeRemaining !== null 
    ? formatTime(timeRemaining) 
    : formatTime(selectedDuration * 60);

  const durations = [10, 25, 45, 90];
  const activeTab = TOWER_TABS.find(t => t.id === selectedTab);

  // Spacing tokens for consistent vertical rhythm
  const space = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    safeBottom: 32,
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    header: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
    },
    menuButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    energyBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.18)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    energyText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700' as const,
    },
    content: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: space.lg,
      paddingBottom: space.xl,
    },
    motivationalText: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.textPrimary,
      textAlign: 'center',
      marginTop: space.lg,
      marginBottom: space.md,
    },
    buildingContainer: {
      alignItems: 'center',
    },
    buildingCard: {
      width: '100%',
      maxWidth: 320,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 1,
      position: 'relative' as const,
      marginBottom: space.lg,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    levelBadge: {
      position: 'absolute' as const,
      top: 8,
      right: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    levelText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700' as const,
    },
    progressRingContainer: {
      position: 'relative' as const,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buildingIconContainer: {
      position: 'absolute' as const,
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 40,
    },
    buildingImage: {
      width: 120,
      height: 160,
      resizeMode: 'contain' as const,
    },
    buildingAnimationContainer: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: 120,
    },
    foundationIndicator: {
      position: 'absolute' as const,
      bottom: -20,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    foundationBase: {
      width: 100,
      height: 8,
      backgroundColor: '#8B7355',
      borderRadius: 4,
      opacity: 0.8,
    },

    intentionBanner: {
      marginTop: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#EAF4FA',
      borderRadius: 12,
    },
    intentionBannerDisabled: {
      opacity: 0.6,
      backgroundColor: '#F0F4F8',
    },
    intentionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    intentionText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600' as const,
    },
    timerDisplay: {
      fontSize: 44,
      fontWeight: '800' as const,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: space.md,
      letterSpacing: 1,
    },
    durationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 12,
      marginBottom: space.lg,
      gap: 10,
    },
    durationPill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.outline,
      backgroundColor: colors.surface,
    },
    durationPillActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    durationText: {
      fontSize: 14,
      fontWeight: '700' as const,
      color: colors.textSecondary,
    },
    durationTextActive: {
      color: '#FFFFFF',
    },
    controlsContainer: {
      alignItems: 'center',
    },
    mainActionButton: {
      paddingHorizontal: 32,
      height: 52,
      backgroundColor: colors.primary,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
      marginHorizontal: 8,
      marginBottom: space.safeBottom,
      paddingVertical: 14,
      alignSelf: 'center',
    },
    giveUpButton: {
      backgroundColor: colors.danger,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    mainButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700' as const,
    },
    tagChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#EAF4FA',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      marginTop: 16,
      alignSelf: 'center',
    },
    tagText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600' as const,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.textPrimary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
    },
    tagsList: {
      maxHeight: 300,
    },
    tagItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    tagItemActive: {
      backgroundColor: 'rgba(46, 134, 171, 0.08)',
    },
    tagItemDisabled: {
      opacity: 0.5,
    },
    tagIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagIconContainerActive: {
      backgroundColor: 'rgba(46, 134, 171, 0.12)',
    },
    tagItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    tagItemInfo: {
      gap: 2,
    },
    tagItemName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.textPrimary,
    },
    tagItemNameActive: {
      color: colors.primary,
    },
    tagItemStats: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 48,
      gap: 8,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.textPrimary,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 32,
    },
    manageTagsSection: {
      borderTopWidth: 1,
      borderTopColor: colors.outline,
      padding: 16,
    },
    manageTagsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: 48,
      backgroundColor: colors.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    manageTagsText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmarkText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700' as const,
    },
    modalFooter: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.outline,
      backgroundColor: 'rgba(46, 134, 171, 0.05)',
    },
    modalFooterText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic' as const,
    },
    giveUpModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    giveUpModalContent: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      width: '85%',
      maxWidth: 320,
      alignItems: 'center',
    },
    giveUpModalTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.textPrimary,
      marginBottom: 12,
    },
    giveUpModalMessage: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    giveUpModalButtons: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    giveUpModalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    giveUpCancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    giveUpCancelText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    },
    giveUpConfirmButton: {
      backgroundColor: colors.danger,
    },
    giveUpConfirmText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    colorDot: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 4,
      borderWidth: 2,
      borderColor: colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    tagDotSmall: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 2,
    },
    emptyDotsContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    emptyDot: {
      width: 28,
      height: 28,
      borderRadius: 14,
      opacity: 0.5,
    },

  }), [colors, space.lg, space.md, space.safeBottom, space.xl]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Clean Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              // Simple navigation to different screens
              console.log('Menu pressed - navigating to settings');
              router.push('/(tabs)/settings');
            }}
            style={styles.menuButton}
            accessibilityLabel="Open menu"
          >
            <Menu size={22} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.energyBadge}
            onPress={() => router.push('/(tabs)/donate')}
          >
            <Text style={styles.energyText}>{totalEnergy} ⚡</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >


          {/* Hero Header */}
          <Text style={styles.motivationalText}>
            {currentSession?.isActive 
              ? (currentSession.isPaused ? 'Paused - Keep building!' : 'Construction in progress...')
              : 'Start building today!'}
          </Text>

          {/* Building Visualization - Using TowerVisualization component */}
          <View style={styles.buildingContainer}>
            <TowerVisualization
              tower={towers?.[selectedTab as TowerType] || {
                type: selectedTab as TowerType,
                level: 1,
                energyInvested: 0,
                currentGoal: '',
                progress: sessionProgress * 100,
              }}
              isActive={currentSession?.isActive || false}
              progress={sessionProgress * 100}
              towerType={selectedTab as TowerType}
            />
            
            <TouchableOpacity 
              style={[styles.intentionBanner, currentSession?.isActive && styles.intentionBannerDisabled]}
              onPress={() => !currentSession?.isActive && setShowTagModal(true)}
              activeOpacity={currentSession?.isActive ? 1 : 0.8}
              disabled={currentSession?.isActive}
            >
              <View style={styles.intentionContent}>
                {selectedTagId && tags ? (
                  <View style={[styles.tagDotSmall, { backgroundColor: tags.find(t => t.id === selectedTagId)?.color || colors.primary }]} />
                ) : (
                  <View style={[styles.tagDotSmall, { backgroundColor: colors.primary }]} />
                )}
                <Text style={styles.intentionText}>
                  {getSelectedTagName() || `${activeTab?.label} Tower`}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Timer Display */}
          <Text style={styles.timerDisplay}>{displayTime}</Text>

          {/* Duration Pills */}
          {!currentSession?.isActive && (
            <View style={styles.durationContainer}>
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationPill,
                    selectedDuration === duration && styles.durationPillActive
                  ]}
                  onPress={() => {
                    if (duration && typeof duration === 'number' && duration > 0 && duration <= 180) {
                      setSelectedDuration(duration);
                    }
                  }}
                >
                  <Text style={[
                    styles.durationText,
                    selectedDuration === duration && styles.durationTextActive
                  ]}>
                    {duration}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Single Main Control Button */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[
                styles.mainActionButton,
                currentSession?.isActive && styles.giveUpButton
              ]}
              onPress={handleStartBuilding}
              activeOpacity={0.9}
            >
              <View style={styles.buttonContent}>
                {currentSession?.isActive ? (
                  <>
                    <Slash size={20} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.mainButtonText}>Give Up</Text>
                  </>
                ) : (
                  <Text style={styles.mainButtonText}>Build</Text>
                )}
              </View>
            </TouchableOpacity>


          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Tag Picker Modal */}
      <Modal
        visible={showTagModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowTagModal(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Activity</Text>
              <TouchableOpacity onPress={() => {
                setShowTagModal(false);
                setSearchQuery('');
              }}>
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Search size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search activities..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Tags List */}
            <ScrollView style={styles.tagsList}>
              {filteredTags.length === 0 ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyDotsContainer}>
                    <View style={[styles.emptyDot, { backgroundColor: '#FF6B6B' }]} />
                    <View style={[styles.emptyDot, { backgroundColor: '#4ECDC4' }]} />
                    <View style={[styles.emptyDot, { backgroundColor: '#45B7D1' }]} />
                  </View>
                  <Text style={styles.emptyTitle}>
                    {searchQuery ? 'No activities found' : 'No activities yet'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {searchQuery ? 'Try a different search' : 'Go to Tags menu to create activities'}
                  </Text>
                </View>
              ) : (
                filteredTags.map((tag) => {
                  const isActive = selectedTagId === tag.id;
                  return (
                    <TouchableOpacity
                      key={tag.id}
                      style={[styles.tagItem, isActive && styles.tagItemActive, currentSession?.isActive && styles.tagItemDisabled]}
                      onPress={() => !currentSession?.isActive && handleSelectTag(tag.id)}
                      disabled={currentSession?.isActive}
                    >
                      <View style={styles.tagItemLeft}>
                        <View style={[styles.colorDot, { backgroundColor: tag.color || '#2E86AB' }]} />
                        <View style={styles.tagItemInfo}>
                          <Text style={[styles.tagItemName, isActive && styles.tagItemNameActive]}>
                            {tag.name}
                          </Text>
                          <Text style={styles.tagItemStats}>
                            {tag.sessions} sessions • {formatTagTime(tag.totalMinutes)}
                          </Text>
                        </View>
                      </View>
                      {isActive && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>



            {currentSession?.isActive && (
              <View style={styles.modalFooter}>
                <Text style={styles.modalFooterText}>
                  Cannot change activity during active session
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Give Up Confirmation Modal */}
      <Modal
        visible={showGiveUpModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowGiveUpModal(false)}
      >
        <View style={styles.giveUpModalOverlay}>
          <View style={styles.giveUpModalContent}>
            <Text style={styles.giveUpModalTitle}>Give up?</Text>
            <Text style={styles.giveUpModalMessage}>
              You&apos;ll lose progress from this session. Continue?
            </Text>
            <View style={styles.giveUpModalButtons}>
              <TouchableOpacity
                style={[styles.giveUpModalButton, styles.giveUpCancelButton]}
                onPress={() => setShowGiveUpModal(false)}
              >
                <Text style={styles.giveUpCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.giveUpModalButton, styles.giveUpConfirmButton]}
                onPress={handleGiveUp}
              >
                <Text style={styles.giveUpConfirmText}>Give Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}