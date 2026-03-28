import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { TowerType } from '@/types';
import { BUILDING_ASSETS, BuildingAsset } from '@/constants/buildings';

interface HouseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectHouse: (towerType: TowerType) => void;
  currentSelection?: TowerType;
}

const { width } = Dimensions.get('window');
const GRID_COLUMNS = 2;
const ITEM_MARGIN = 16;
const ITEM_WIDTH = (width - (GRID_COLUMNS + 1) * ITEM_MARGIN) / GRID_COLUMNS;

export default function HouseSelectionModal({
  visible,
  onClose,
  onSelectHouse,
  currentSelection,
}: HouseSelectionModalProps) {
  const buildingEntries = Object.entries(BUILDING_ASSETS) as [TowerType, BuildingAsset][];

  const handleSelectHouse = (towerType: TowerType) => {
    onSelectHouse(towerType);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Building</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Select the building you want to construct during your focus sessions
        </Text>

        {/* Grid */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          {buildingEntries.map(([towerType, building]) => {
            const isSelected = currentSelection === towerType;
            
            return (
              <TouchableOpacity
                key={towerType}
                style={[
                  styles.buildingCard,
                  isSelected && styles.selectedCard,
                ]}
                onPress={() => handleSelectHouse(towerType)}
                activeOpacity={0.7}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={building.localPath}
                    style={styles.buildingImage}
                    resizeMode="contain"
                  />
                  {isSelected && (
                    <View style={styles.selectedOverlay}>
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    </View>
                  )}
                </View>
                
                <View style={styles.buildingInfo}>
                  <Text style={styles.buildingName}>{building.name}</Text>
                  <Text style={styles.buildingLevel}>Level {building.level} Building</Text>
                  <Text style={styles.towerType}>{towerType.charAt(0).toUpperCase() + towerType.slice(1)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  buildingCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#2E86AB',
    shadowColor: '#2E86AB',
    shadowOpacity: 0.3,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
  },
  buildingImage: {
    width: '80%',
    height: '80%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 134, 171, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E86AB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  buildingInfo: {
    padding: 12,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  buildingLevel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  towerType: {
    fontSize: 12,
    color: '#2E86AB',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});