import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Tower, TowerType } from '@/types';
import { getBuildingImageSource } from '@/constants/buildings';
import HouseSelectionModal from '@/components/HouseSelectionModal';
import { useFocusFlow } from '@/store/focusflow-context';

interface TowerVisualizationProps {
  tower: Tower | undefined;
  isActive: boolean;
  progress: number;
  towerType?: TowerType;
  buildingState?: 'preview' | 'foundation' | 'constructing' | 'completed';
  buildingHeightAnim?: Animated.Value;
}

export default function TowerVisualization({ tower, isActive, progress, towerType, buildingState = 'preview', buildingHeightAnim }: TowerVisualizationProps) {
  const [imageError, setImageError] = useState<boolean>(false);
  const [showHouseModal, setShowHouseModal] = useState<boolean>(false);
  const { selectedBuildingType, setSelectedBuildingType } = useFocusFlow();
  
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

  // Determine which building to show - use selected building type, tower type, or fallback
  const buildingType = selectedBuildingType || towerType || tower?.type || 'personal';
  const buildingImageSource = getBuildingImageSource(buildingType);
  
  const handleBuildingPress = () => {
    setShowHouseModal(true);
  };
  
  const handleSelectBuilding = (newBuildingType: TowerType) => {
    setSelectedBuildingType(newBuildingType);
  };
  
  // Validate image source
  const hasValidImageSource = buildingImageSource && 
    (typeof buildingImageSource === 'number' || 
     (typeof buildingImageSource === 'object' && buildingImageSource.uri));

  return (
    <View style={styles.container}>
      {/* Tower/Building image - Clickable */}
      <TouchableOpacity 
        style={styles.houseContainer}
        onPress={handleBuildingPress}
        activeOpacity={0.8}
      >
        {hasValidImageSource && !imageError ? (
          buildingHeightAnim ? (
            <Animated.View style={[styles.animatedContainer, { height: buildingHeightAnim }]}>
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
            </Animated.View>
          ) : (
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
          )
        ) : (
          buildingHeightAnim ? (
            <Animated.View style={[styles.animatedContainer, { height: buildingHeightAnim }]}>
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
            </Animated.View>
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
          )
        )}

      </TouchableOpacity>
      
      {/* Foundation indicator when in foundation state */}
      {buildingState === 'foundation' && (
        <View style={styles.foundationIndicator}>
          <View style={styles.foundationBase} />
        </View>
      )}
        
      {/* Construction indicator overlay when active */}
      {isActive && buildingState === 'constructing' && (
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
      
      {/* House Selection Modal */}
      <HouseSelectionModal
        visible={showHouseModal}
        onClose={() => setShowHouseModal(false)}
        onSelectHouse={handleSelectBuilding}
        currentSelection={selectedBuildingType}
      />
      
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
  foundationIndicator: {
    position: 'absolute',
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
  animatedContainer: {
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },

});