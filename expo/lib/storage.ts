import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Tower, TowerType, CurrentSession, Settings, Achievement, DonationCause, Tag, ACHIEVEMENTS_DATA, DONATION_CAUSES } from '@/types';

const STORAGE_KEYS = {
  USER_PROFILE: 'focusflow.user.profile.v1',
  TOWERS: 'focusflow.towers.v1',
  CURRENT_SESSION: 'focusflow.session.v1',
  SETTINGS: 'focusflow.settings.v1',
  ACHIEVEMENTS: 'focusflow.achievements.v1',
  DONATION_CAUSES: 'focusflow.causes.v1',
  ONBOARDING_COMPLETE: 'focusflow.onboarding.v1',
  TAGS: 'focusflow.tags.v1',
  SELECTED_TAG_ID: 'focusflow.selected.tag.v1',
  THEME_ID: 'ff.user.theme_id',
} as const;

const DEFAULT_USER_PROFILE: UserProfile = {
  totalEnergy: 0,
  currentStreak: 0,
  lifetimeSessions: 0,
  totalFocusTime: 0,
  selectedCauses: [],
  lastSessionDate: null,
  totalDonated: 0,
};

const DEFAULT_TOWERS: Record<TowerType, Tower> = {
  career: { type: 'career', level: 0, energyInvested: 0, currentGoal: '', progress: 0 },
  health: { type: 'health', level: 0, energyInvested: 0, currentGoal: '', progress: 0 },
  learning: { type: 'learning', level: 0, energyInvested: 0, currentGoal: '', progress: 0 },
  creativity: { type: 'creativity', level: 0, energyInvested: 0, currentGoal: '', progress: 0 },
  relationships: { type: 'relationships', level: 0, energyInvested: 0, currentGoal: '', progress: 0 },
  personal: { type: 'personal', level: 0, energyInvested: 0, currentGoal: '', progress: 0 },
};

const DEFAULT_SETTINGS: Settings = {
  constructionSounds: true,
  celebrationEffects: true,
  volume: 70,
  architecturalStyle: 'modern',
  weatherEffects: true,
  sessionReminders: true,
  streakNotifications: true,
  impactUpdates: true,
  themeId: 'modern_teal',
};

export const storage = {
  async getUserProfile(): Promise<UserProfile> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!data || data === 'undefined' || data === 'null') return DEFAULT_USER_PROFILE;
      
      try {
        const parsed = JSON.parse(data);
        // Validate the parsed data has expected structure
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          return { ...DEFAULT_USER_PROFILE, ...parsed };
        }
      } catch (parseError) {
        console.error('Invalid JSON in user profile, resetting:', parseError);
        console.error('Data was:', typeof data === 'string' ? data : 'Invalid data type');
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      }
      return DEFAULT_USER_PROFILE;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return DEFAULT_USER_PROFILE;
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  },

  async getTowers(): Promise<Record<TowerType, Tower>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TOWERS);
      if (!data || data === 'undefined' || data === 'null') return DEFAULT_TOWERS;
      
      try {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          // Merge with defaults to ensure all towers exist
          return { ...DEFAULT_TOWERS, ...parsed };
        }
      } catch (parseError) {
        console.error('Invalid JSON in towers, resetting:', parseError);
        console.error('Data was:', typeof data === 'string' ? data : 'Invalid data type');
        await AsyncStorage.removeItem(STORAGE_KEYS.TOWERS);
      }
      return DEFAULT_TOWERS;
    } catch (error) {
      console.error('Failed to load towers:', error);
      return DEFAULT_TOWERS;
    }
  },

  async saveTowers(towers: Record<TowerType, Tower>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOWERS, JSON.stringify(towers));
    } catch (error) {
      console.error('Failed to save towers:', error);
    }
  },

  async getCurrentSession(): Promise<CurrentSession | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      if (!data || data === 'undefined' || data === 'null') return null;
      
      try {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (parseError) {
        console.error('Invalid JSON in current session, clearing:', parseError);
        console.error('Data was:', typeof data === 'string' ? data : 'Invalid data type');
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      }
      return null;
    } catch (error) {
      console.error('Failed to load current session:', error);
      return null;
    }
  },

  async saveCurrentSession(session: CurrentSession | null): Promise<void> {
    try {
      if (session) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      }
    } catch (error) {
      console.error('Failed to save current session:', error);
    }
  },

  async getSettings(): Promise<Settings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data || data === 'undefined' || data === 'null') return DEFAULT_SETTINGS;
      
      try {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
      } catch (parseError) {
        console.error('Invalid JSON in settings, resetting:', parseError);
        console.error('Data was:', typeof data === 'string' ? data : 'Invalid data type');
        await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  async getAchievements(): Promise<Achievement[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (data && data !== 'undefined' && data !== 'null') {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (parseError) {
          console.error('Invalid JSON in achievements, resetting:', parseError);
          console.error('Data was:', typeof data === 'string' ? data : 'Invalid data type');
          await AsyncStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
        }
      }
      // Initialize with default achievements
      const achievements = [...ACHIEVEMENTS_DATA];
      await this.saveAchievements(achievements);
      return achievements;
    } catch (error) {
      console.error('Failed to load achievements:', error);
      return [...ACHIEVEMENTS_DATA];
    }
  },

  async saveAchievements(achievements: Achievement[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  },

  async getDonationCauses(): Promise<DonationCause[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DONATION_CAUSES);
      if (data && data !== 'undefined' && data !== 'null') {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (parseError) {
          console.error('Invalid JSON in donation causes, resetting:', parseError);
          console.error('Data was:', typeof data === 'string' ? data : 'Invalid data type');
          await AsyncStorage.removeItem(STORAGE_KEYS.DONATION_CAUSES);
        }
      }
      // Initialize with default causes
      const causes = [...DONATION_CAUSES];
      await this.saveDonationCauses(causes);
      return causes;
    } catch (error) {
      console.error('Failed to load donation causes:', error);
      return [...DONATION_CAUSES];
    }
  },

  async saveDonationCauses(causes: DonationCause[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DONATION_CAUSES, JSON.stringify(causes));
    } catch (error) {
      console.error('Failed to save donation causes:', error);
    }
  },

  async isOnboardingComplete(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      return data === 'true';
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      return false;
    }
  },

  async setOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  },

  async getTags(): Promise<Tag[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TAGS);
      if (data && data !== 'undefined' && data !== 'null') {
        try {
          // AsyncStorage.getItem always returns a string or null
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (parseError) {
          console.error('Invalid JSON in tags, resetting:', parseError);
          console.error('Data type:', typeof data);
          console.error('Data was:', typeof data === 'string' ? data : 'Invalid data type');
          await AsyncStorage.removeItem(STORAGE_KEYS.TAGS);
        }
      }
      
      // Initialize with default tags for better UX
      const { TAG_COLORS } = await import('@/types');
      const defaultTags: Tag[] = [
        { id: '1', name: 'Deep Work', color: TAG_COLORS[0], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '2', name: 'Study', color: TAG_COLORS[1], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '3', name: 'Exercise', color: TAG_COLORS[2], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '4', name: 'Meditation', color: TAG_COLORS[3], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '5', name: 'Reading', color: TAG_COLORS[4], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '6', name: 'Writing', color: TAG_COLORS[5], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '7', name: 'Planning', color: TAG_COLORS[6], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '8', name: 'Creative Work', color: TAG_COLORS[7], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
      ];
      
      console.log('Initializing with default tags:', defaultTags.length);
      await this.saveTags(defaultTags);
      return defaultTags;
    } catch (error) {
      console.error('Failed to load tags:', error);
      // Return default tags even on error
      const { TAG_COLORS } = await import('@/types');
      const defaultTags: Tag[] = [
        { id: '1', name: 'Deep Work', color: TAG_COLORS[0], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '2', name: 'Study', color: TAG_COLORS[1], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '3', name: 'Exercise', color: TAG_COLORS[2], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '4', name: 'Meditation', color: TAG_COLORS[3], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '5', name: 'Reading', color: TAG_COLORS[4], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '6', name: 'Writing', color: TAG_COLORS[5], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '7', name: 'Planning', color: TAG_COLORS[6], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
        { id: '8', name: 'Creative Work', color: TAG_COLORS[7], sessions: 0, totalMinutes: 0, createdAt: new Date().toISOString(), lastUsed: null },
      ];
      return defaultTags;
    }
  },

  async saveTags(tags: Tag[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
    } catch (error) {
      console.error('Failed to save tags:', error);
    }
  },

  async getSelectedTagId(): Promise<string | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_TAG_ID);
      return data || null;
    } catch (error) {
      console.error('Failed to load selected tag:', error);
      return null;
    }
  },

  async saveSelectedTagId(tagId: string | null): Promise<void> {
    try {
      if (tagId) {
        await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_TAG_ID, tagId);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_TAG_ID);
      }
    } catch (error) {
      console.error('Failed to save selected tag:', error);
    }
  },

  async getThemeId(): Promise<string | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.THEME_ID);
      return data || null;
    } catch (error) {
      console.error('Failed to load theme ID:', error);
      return null;
    }
  },

  async saveThemeId(themeId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_ID, themeId);
    } catch (error) {
      console.error('Failed to save theme ID:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },

  async validateAndFixStorage(): Promise<{ fixed: boolean; errors: string[] }> {
    const errors: string[] = [];
    let fixed = false;

    try {
      // Check each storage key
      for (const [keyName, storageKey] of Object.entries(STORAGE_KEYS)) {
        try {
          const data = await AsyncStorage.getItem(storageKey);
          if (data && data !== 'true' && data !== 'false' && data !== 'null' && data !== 'undefined') {
            // Try to parse the data
            try {
              JSON.parse(data);
            } catch (parseError) {
              errors.push(`${keyName}: Invalid JSON`);
              // Clear the corrupted data
              await AsyncStorage.removeItem(storageKey);
              fixed = true;
            }
          }
        } catch (error) {
          errors.push(`${keyName}: ${(error as Error).message}`);
        }
      }
    } catch (error) {
      errors.push(`General error: ${(error as Error).message}`);
    }

    return { fixed, errors };
  },
};