import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { storage } from '@/lib/storage';
import { playCompletionSound } from '@/lib/audio';
import { 
  UserProfile, 
  Tower, 
  TowerType, 
  CurrentSession, 
  Settings, 
  Achievement,
  DonationCause,
  Tag,
  TOWER_METADATA 
} from '@/types';

const ENERGY_PER_MINUTE = 10;
const STREAK_BONUS = 1.2;
const LONG_SESSION_BONUS = 1.5;
const LEVEL_ENERGY_REQUIREMENT = 500; // Energy needed per level

export const [FocusFlowProvider, useFocusFlow] = createContextHook(() => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [towers, setTowers] = useState<Record<TowerType, Tower> | null>(null);
  const [currentSession, setCurrentSession] = useState<CurrentSession | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [donationCauses, setDonationCauses] = useState<DonationCause[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTower, setSelectedTower] = useState<TowerType>('career');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState<TowerType>('personal');
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Load selected tag from storage
  useEffect(() => {
    const loadSelectedTag = async () => {
      try {
        const savedTagId = await storage.getSelectedTagId();
        if (savedTagId) {
          setSelectedTagId(savedTagId);
        }
      } catch (error) {
        console.error('Failed to load selected tag:', error);
      }
    };
    loadSelectedTag();
  }, []);

  const loadData = async () => {
    try {
      const [profile, towersData, session, settingsData, achievementsData, causesData, tagsData] = await Promise.all([
        storage.getUserProfile(),
        storage.getTowers(),
        storage.getCurrentSession(),
        storage.getSettings(),
        storage.getAchievements(),
        storage.getDonationCauses(),
        storage.getTags(),
      ]);

      setUserProfile(profile);
      setTowers(towersData);
      setCurrentSession(session);
      setSettings(settingsData);
      setAchievements(achievementsData);
      setDonationCauses(causesData);
      
      // Ensure tags is always an array
      if (Array.isArray(tagsData)) {
        setTags(tagsData);
      } else {
        console.warn('Tags data is not an array, using empty array');
        setTags([]);
      }
      
      // Resume session if it was active
      if (session && session.isActive && !session.isPaused) {
        startTimer();
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Initialize with defaults on error
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Timer logic
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCurrentSession(prev => {
        if (!prev || !prev.isActive || prev.isPaused) return prev;
        
        const now = Date.now();
        const elapsed = prev.startTime ? (now - prev.startTime) / 1000 : 0;
        const remaining = Math.max(0, Math.floor(prev.duration - elapsed - prev.pausedTime));
        
        if (remaining <= 0 && prev.remaining > 0) {
          // Session completed
          handleSessionComplete();
          return {
            ...prev,
            remaining: 0,
            isActive: false,
          };
        }
        
        return {
          ...prev,
          remaining,
        };
      });
    }, 1000);
  }, []);

  const handleSessionComplete = async () => {
    if (!currentSession || !userProfile || !towers) return;
    
    // Play completion sound and haptic
    if (settings?.constructionSounds) {
      await playCompletionSound();
    }
    if (settings?.celebrationEffects && Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Calculate energy earned
    const baseEnergy = Math.floor(currentSession.duration / 60) * ENERGY_PER_MINUTE;
    let multiplier = 1;
    
    // Apply streak bonus
    if (userProfile.currentStreak >= 3) {
      multiplier *= STREAK_BONUS;
    }
    
    // Apply long session bonus
    if (currentSession.duration >= 2700) {
      multiplier *= LONG_SESSION_BONUS;
    }
    
    const energyEarned = Math.floor(baseEnergy * multiplier);
    
    // Update user profile
    const today = new Date().toDateString();
    const lastSession = userProfile.lastSessionDate ? new Date(userProfile.lastSessionDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = userProfile.currentStreak;
    if (lastSession !== today) {
      if (lastSession === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }
    
    const updatedProfile: UserProfile = {
      ...userProfile,
      totalEnergy: userProfile.totalEnergy + energyEarned,
      currentStreak: newStreak,
      lifetimeSessions: userProfile.lifetimeSessions + 1,
      totalFocusTime: userProfile.totalFocusTime + currentSession.duration,
      lastSessionDate: new Date().toISOString(),
    };
    
    // Update tower
    if (currentSession.towerType) {
      const tower = towers[currentSession.towerType];
      const newEnergyInvested = tower.energyInvested + energyEarned;
      const newLevel = Math.floor(newEnergyInvested / LEVEL_ENERGY_REQUIREMENT);
      const levelProgress = ((newEnergyInvested % LEVEL_ENERGY_REQUIREMENT) / LEVEL_ENERGY_REQUIREMENT) * 100;
      
      const updatedTowers = {
        ...towers,
        [currentSession.towerType]: {
          ...tower,
          energyInvested: newEnergyInvested,
          level: newLevel,
          progress: levelProgress,
        },
      };
      
      setTowers(updatedTowers);
      await storage.saveTowers(updatedTowers);
      
      // Check achievements
      await checkAchievements(updatedProfile, updatedTowers);
    }
    
    setUserProfile(updatedProfile);
    await storage.saveUserProfile(updatedProfile);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const checkAchievements = async (profile: UserProfile, towersData: Record<TowerType, Tower>) => {
    const updatedAchievements = [...achievements];
    let hasNewAchievement = false;
    
    // Check first tower achievement
    if (profile.lifetimeSessions === 1) {
      const achievement = updatedAchievements.find(a => a.id === 'first_tower');
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
        hasNewAchievement = true;
      }
    }
    
    // Check streak achievements
    if (profile.currentStreak >= 3) {
      const achievement = updatedAchievements.find(a => a.id === 'streak_3');
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
        hasNewAchievement = true;
      }
    }
    
    if (profile.currentStreak >= 7) {
      const achievement = updatedAchievements.find(a => a.id === 'week_warrior');
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
        hasNewAchievement = true;
      }
    }
    
    if (profile.currentStreak >= 30) {
      const achievement = updatedAchievements.find(a => a.id === 'month_master');
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
        hasNewAchievement = true;
      }
    }
    
    // Check tower level achievements
    const maxLevel = Math.max(...Object.values(towersData).map(t => t.level));
    if (maxLevel >= 10) {
      const achievement = updatedAchievements.find(a => a.id === 'architect');
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
        hasNewAchievement = true;
      }
    }
    
    if (maxLevel >= 25) {
      const achievement = updatedAchievements.find(a => a.id === 'master_builder');
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
        hasNewAchievement = true;
      }
    }
    
    // Check city planner achievement
    const allTowersBuilt = Object.values(towersData).every(t => t.level > 0);
    if (allTowersBuilt) {
      const achievement = updatedAchievements.find(a => a.id === 'city_planner');
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
        hasNewAchievement = true;
      }
    }
    
    if (hasNewAchievement) {
      setAchievements(updatedAchievements);
      await storage.saveAchievements(updatedAchievements);
      
      // Show celebration
      if (settings?.celebrationEffects && Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const startSession = async (towerType: TowerType | string, duration: number, intention: string) => {
    const session: CurrentSession = {
      towerType: towerType as TowerType,
      duration,
      remaining: duration,
      isActive: true,
      isPaused: false,
      intention,
      startTime: Date.now(),
      pausedTime: 0,
      energyEarned: 0,
    };
    
    setCurrentSession(session);
    await storage.saveCurrentSession(session);
    startTimer();
    
    if (settings?.constructionSounds && Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const pauseSession = async () => {
    if (!currentSession || !currentSession.isActive) return;
    
    const updatedSession = {
      ...currentSession,
      isPaused: true,
      pausedTime: currentSession.pausedTime + (Date.now() - (currentSession.startTime || Date.now())) / 1000,
    };
    
    setCurrentSession(updatedSession);
    await storage.saveCurrentSession(updatedSession);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resumeSession = async () => {
    if (!currentSession || !currentSession.isActive || !currentSession.isPaused) return;
    
    const updatedSession = {
      ...currentSession,
      isPaused: false,
      startTime: Date.now(),
    };
    
    setCurrentSession(updatedSession);
    await storage.saveCurrentSession(updatedSession);
    startTimer();
  };

  const stopSession = async () => {
    setCurrentSession(null);
    await storage.saveCurrentSession(null);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await storage.saveSettings(updatedSettings);
  };

  const updateTowerGoal = async (towerType: TowerType, goal: string) => {
    if (!towers) return;
    
    const updatedTowers = {
      ...towers,
      [towerType]: {
        ...towers[towerType],
        currentGoal: goal,
      },
    };
    
    setTowers(updatedTowers);
    await storage.saveTowers(updatedTowers);
  };

  const donateEnergy = async (causeId: string, amount: number) => {
    if (!userProfile || userProfile.totalEnergy < amount) return false;
    
    const updatedProfile = {
      ...userProfile,
      totalEnergy: userProfile.totalEnergy - amount,
      totalDonated: userProfile.totalDonated + amount,
    };
    
    const updatedCauses = donationCauses.map(cause => {
      if (cause.id === causeId) {
        return {
          ...cause,
          totalContributed: cause.totalContributed + amount,
          progress: Math.min(100, cause.progress + (amount / 100)), // Simple progress calculation
        };
      }
      return cause;
    });
    
    setUserProfile(updatedProfile);
    setDonationCauses(updatedCauses);
    
    await storage.saveUserProfile(updatedProfile);
    await storage.saveDonationCauses(updatedCauses);
    
    // Check donation achievements
    if (updatedProfile.totalDonated >= 100) {
      const updatedAchievements = [...achievements];
      const achievement = updatedAchievements.find(a => a.id === 'first_donation');
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
        setAchievements(updatedAchievements);
        await storage.saveAchievements(updatedAchievements);
      }
    }
    
    return true;
  };

  const addTag = async (name: string, color?: string): Promise<Tag | null> => {
    // Check if tag already exists
    const existingTag = tags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (existingTag) return null; // Return null if tag already exists
    
    // Import TAG_COLORS from types
    const { TAG_COLORS } = await import('@/types');
    
    // Get a color that's not already in use, or use provided color
    const usedColors = tags.map(t => t.color);
    const availableColors = TAG_COLORS.filter(c => !usedColors.includes(c));
    const selectedColor = color || availableColors[0] || TAG_COLORS[tags.length % TAG_COLORS.length];
    
    const newTag: Tag = {
      id: Date.now().toString(),
      name: name.trim(),
      color: selectedColor,
      sessions: 0,
      totalMinutes: 0,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };
    
    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    await storage.saveTags(updatedTags);
    
    return newTag;
  };

  const updateTag = async (tagId: string, updates: Partial<Tag>): Promise<void> => {
    const updatedTags = tags.map(tag => 
      tag.id === tagId ? { ...tag, ...updates } : tag
    );
    
    setTags(updatedTags);
    await storage.saveTags(updatedTags);
  };

  const deleteTag = async (tagId: string): Promise<void> => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);
    await storage.saveTags(updatedTags);
    
    // If the deleted tag was selected, clear the selection
    if (selectedTagId === tagId) {
      setSelectedTagId(null);
      await storage.saveSelectedTagId(null);
    }
  };

  const selectTag = async (tagId: string | null): Promise<void> => {
    setSelectedTagId(tagId);
    await storage.saveSelectedTagId(tagId);
  };

  return {
    userProfile,
    towers,
    currentSession,
    settings,
    achievements,
    donationCauses,
    tags,
    isLoading,
    selectedTower,
    setSelectedTower,
    selectedTagId,
    selectTag,
    selectedBuildingType,
    setSelectedBuildingType,
    totalEnergy: userProfile?.totalEnergy || 0,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    updateSettings,
    updateTowerGoal,
    donateEnergy,
    addTag,
    updateTag,
    deleteTag,
    reloadData: loadData,
  };
});