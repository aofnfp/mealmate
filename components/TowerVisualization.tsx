import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Tower, TowerType } from '@/types';
import { getBuildingImageSource } from '@/constants/buildings';

interface TowerVisualizationProps {
  tower: Tower | undefined;
  isActive: boolean;
  progress: number;
  towerType?: TowerType; // Add towerType to determine which building to show
}

export default function TowerVisualization({ tower, isActive, progress, towerType }: TowerVisualizationProps) {
  const [imageError, setImageError] = useState<boolean>(false);
  
  if (!tower) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Start your first session</Text>
          <Text style={styles.emptySubtext}>to begin building this tower</Text>
        </View>
      </View>
    );
  }

  // Calculate scale based on level (starts at 1, grows with each level)
  const scale = Math.min(1 + (tower.level - 1) * 0.05, 2); // Max scale of 2x
  const imageSize = 120 * scale;

  // Determine which building to show - use tower type or fallback to 'personal'
  const buildingType = towerType || tower.type || 'personal';
  const buildingImageSource = getBuildingImageSource(buildingType);
  
  // Validate image source
  const hasValidImageSource = buildingImageSource && 
    (typeof buildingImageSource === 'number' || 
     (typeof buildingImageSource === 'object' && buildingImageSource.uri));

  return (
    <View style={styles.container}>
      {/* Tower/Building image */}
      <View style={styles.houseContainer}>
        {hasValidImageSource && !imageError ? (
          <Image
            source={buildingImageSource}
            style={[
              styles.houseImage,
              {
                width: imageSize,
                height: imageSize * 1.4,
                opacity: isActive ? 1 : 0.9,
              }
            ]}
            resizeMode="contain"
            onError={(error) => {
              console.warn('Failed to load building image:', error.nativeEvent.error);
              setImageError(true);
            }}
          />
        ) : (
          <View style={[
            styles.fallbackBuilding,
            {
              width: imageSize,
              height: imageSize * 1.4,
              opacity: isActive ? 1 : 0.9,
            }
          ]}>
            <Text style={styles.fallbackText}>🏠</Text>
            <Text style={styles.fallbackLabel}>{buildingType}</Text>
          </View>
        )}
        
        {/* Construction indicator overlay when active */}
        {isActive && (
          <View style={styles.constructionOverlay}>
            <View style={styles.constructionDot} />
            <View style={[styles.constructionDot, styles.constructionDot2]} />
            <View style={[styles.constructionDot, styles.constructionDot3]} />
          </View>
        )}
        
        {/* Progress indicator */}
        {isActive && progress > 0 && (
          <View style={styles.activeProgressBar}>
            <View style={[styles.activeProgressFill, { width: `${progress}%` }]} />
          </View>
        )}
      </View>
      
      {/* Level indicator */}
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Lv. {tower.level}</Text>
      </View>
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${tower.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.floor(tower.progress)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
  },
  houseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  houseImage: {
    marginBottom: 20,
  },
  constructionOverlay: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: 40,
    height: 40,
  },
  constructionDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#FFB300',
    borderRadius: 3,
    opacity: 0.8,
  },
  constructionDot2: {
    top: 10,
    left: 15,
    opacity: 0.6,
  },
  constructionDot3: {
    top: 20,
    left: 5,
    opacity: 0.7,
  },
  activeProgressBar: {
    position: 'absolute',
    bottom: -10,
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  activeProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95A5A6',
  },
  levelBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2E86AB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
  },
  fallbackBuilding: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2E86AB',
    marginBottom: 20,
  },
  fallbackText: {
    fontSize: 48,
    marginBottom: 8,
  },
  fallbackLabel: {
    fontSize: 12,
    color: '#2E86AB',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});