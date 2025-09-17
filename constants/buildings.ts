import { TowerType } from '@/types';

// GitHub raw URLs for building assets
const GITHUB_REPO_BASE = 'https://raw.githubusercontent.com/aofnfp/focusflow/main/assets/images/building';

export interface BuildingAsset {
  id: string;
  name: string;
  url: string;
  localPath: string; // fallback for development
  level: number; // suggested level for this building type
}

export const BUILDING_ASSETS: Record<TowerType, BuildingAsset> = {
  career: {
    id: 'red-brick-tower',
    name: 'Corporate Tower',
    url: `${GITHUB_REPO_BASE}/Red%20brick%20three-story%20house.png`,
    localPath: require('@/assets/images/building/Red brick three-story house.png'),
    level: 3,
  },
  health: {
    id: 'green-wellness-house',
    name: 'Wellness Center',
    url: `${GITHUB_REPO_BASE}/Green%20two-story%20house%20(dark%20roof).png`,
    localPath: require('@/assets/images/building/Green two-story house (dark roof).png'),
    level: 2,
  },
  learning: {
    id: 'cream-apartment',
    name: 'Knowledge Complex',
    url: `${GITHUB_REPO_BASE}/Cream%20four-story%20apartment%20(balconies).png`,
    localPath: require('@/assets/images/building/Cream four-story apartment (balconies).png'),
    level: 4,
  },
  creativity: {
    id: 'orange-studio',
    name: 'Creative Studio',
    url: `${GITHUB_REPO_BASE}/Orange%20single-story%20house.png`,
    localPath: require('@/assets/images/building/Orange single-story house.png'),
    level: 1,
  },
  relationships: {
    id: 'cream-community-house',
    name: 'Community House',
    url: `${GITHUB_REPO_BASE}/Cream%20two-story%20house%20(blue%20roof%2C%20blue%20lower%20section).png`,
    localPath: require('@/assets/images/building/Cream two-story house (blue roof, blue lower section).png'),
    level: 2,
  },
  personal: {
    id: 'beige-sanctuary',
    name: 'Personal Sanctuary',
    url: `${GITHUB_REPO_BASE}/Beige%20single-story%20house.png`,
    localPath: require('@/assets/images/building/Beige single-story house.png'),
    level: 1,
  },
};

// Helper function to get building asset by tower type
export const getBuildingAsset = (towerType: TowerType): BuildingAsset => {
  return BUILDING_ASSETS[towerType];
};

// Helper function to get building by current tower level
export const getBuildingByLevel = (towerType: TowerType, currentLevel: number): BuildingAsset => {
  const baseBuilding = BUILDING_ASSETS[towerType];

  // You could implement logic here to return different buildings based on level
  // For now, we'll return the same building but you could extend this
  return baseBuilding;
};

// Configuration for whether to use remote URLs or local assets
// You can change this to true to test remote loading
export const USE_REMOTE_ASSETS = false; // Set to true to use GitHub URLs, false for local assets

// Helper function to get the appropriate image source
export const getBuildingImageSource = (towerType: TowerType, useRemote: boolean = USE_REMOTE_ASSETS) => {
  const asset = getBuildingAsset(towerType);

  if (useRemote) {
    return { uri: asset.url };
  } else {
    return asset.localPath;
  }
};

// Helper function to get GitHub URL for manual testing
export const getGitHubImageUrl = (towerType: TowerType): string => {
  return getBuildingAsset(towerType).url;
};

// Debug function to log all building URLs
export const logAllBuildingUrls = (): void => {
  console.log('=== Building Asset URLs ===');
  Object.entries(BUILDING_ASSETS).forEach(([towerType, asset]) => {
    console.log(`${towerType}: ${asset.url}`);
  });
  console.log('========================');
};