import { TowerType } from '@/types';

export interface BuildingAsset {
  id: string;
  name: string;
  localPath: any; // require() result
  level: number; // suggested level for this building type
}

export const BUILDING_ASSETS: Record<TowerType, BuildingAsset> = {
  career: {
    id: 'red-brick-tower',
    name: 'Corporate Tower',
    localPath: require('../assets/images/building/Red brick three-story house.png'),
    level: 3,
  },
  health: {
    id: 'green-wellness-house',
    name: 'Wellness Center',
    localPath: require('../assets/images/building/Green two-story house (dark roof).png'),
    level: 2,
  },
  learning: {
    id: 'cream-apartment',
    name: 'Knowledge Complex',
    localPath: require('../assets/images/building/Cream four-story apartment (balconies).png'),
    level: 4,
  },
  creativity: {
    id: 'orange-studio',
    name: 'Creative Studio',
    localPath: require('../assets/images/building/Orange single-story house.png'),
    level: 1,
  },
  relationships: {
    id: 'cream-community-house',
    name: 'Community House',
    localPath: require('../assets/images/building/Cream two-story house (blue roof, blue lower section).png'),
    level: 2,
  },
  personal: {
    id: 'beige-sanctuary',
    name: 'Personal Sanctuary',
    localPath: require('../assets/images/building/Beige single-story house.png'),
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

// Helper function to get the appropriate image source
export const getBuildingImageSource = (towerType: TowerType) => {
  // Validate towerType exists in our assets
  if (!towerType || !BUILDING_ASSETS[towerType]) {
    console.warn(`Invalid tower type: ${towerType}, falling back to 'personal'`);
    return BUILDING_ASSETS['personal'].localPath;
  }

  const asset = getBuildingAsset(towerType);
  return asset.localPath;
};

// Debug function to log all building assets
export const logAllBuildingUrls = (): void => {
  console.log('=== Building Assets ===');
  Object.entries(BUILDING_ASSETS).forEach(([towerType, asset]) => {
    console.log(`${towerType}: ${asset.name} (Level ${asset.level})`);
  });
  console.log('=====================');
};