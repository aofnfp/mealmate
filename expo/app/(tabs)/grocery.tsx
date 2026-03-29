import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useMealStore } from '@/store/meal-store';
import { IngredientCategory } from '@/types';

const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  produce: Colors.success,
  dairy: '#7EADD9',
  meat: '#D4603A',
  seafood: '#D4603A',
  grains: Colors.warning,
  bakery: Colors.warning,
  canned: '#9C9C94',
  spices: '#8B6F47',
  condiments: '#8B6F47',
  frozen: '#7EADD9',
  other: '#9C9C94',
};

const CATEGORY_LABELS: Partial<Record<IngredientCategory, string>> = {
  produce: 'PRODUCE',
  dairy: 'DAIRY & EGGS',
  meat: 'MEAT & SEAFOOD',
  seafood: 'MEAT & SEAFOOD',
  grains: 'GRAINS & PASTA',
  bakery: 'BAKERY',
  canned: 'CANNED GOODS',
  spices: 'SPICES & CONDIMENTS',
  condiments: 'SPICES & CONDIMENTS',
  frozen: 'FROZEN',
  other: 'OTHER',
};

export default function GroceryScreen() {
  const { groceryItems, toggleGroceryItem, clearCheckedGrocery, addManualGroceryItem } = useMealStore();
  const [showAddInput, setShowAddInput] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const checkedCount = groceryItems.filter((i) => i.isChecked).length;
  const totalCount = groceryItems.length;

  // Group by category
  const grouped = groceryItems.reduce<Record<string, typeof groceryItems>>((acc, item) => {
    const label = CATEGORY_LABELS[item.category] || 'OTHER';
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});

  // Sort: unchecked first within each group
  Object.values(grouped).forEach((items) => {
    items.sort((a, b) => Number(a.isChecked) - Number(b.isChecked));
  });

  const handleAddItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    addManualGroceryItem(name, 0, '');
    setNewItemName('');
    setShowAddInput(false);
    Keyboard.dismiss();
  };

  if (totalCount === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Grocery List</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddInput(true)} accessibilityLabel="Add item" accessibilityRole="button">
            <Ionicons name="add" size={20} color={Colors.accent} />
          </TouchableOpacity>
        </View>
        {showAddInput && (
          <View style={styles.addInputRow}>
            <TextInput
              style={styles.addInput}
              placeholder="Add an item..."
              placeholderTextColor={Colors.textTertiary}
              value={newItemName}
              onChangeText={setNewItemName}
              onSubmitEditing={handleAddItem}
              autoFocus
              returnKeyType="done"
              accessibilityLabel="Item name"
              accessibilityHint="Enter a grocery item to add"
            />
            <TouchableOpacity style={styles.addSubmit} onPress={handleAddItem} accessibilityLabel="Confirm add item" accessibilityRole="button">
              <Ionicons name="checkmark" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptySubtitle}>Generate a meal plan to auto-create your grocery list.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Grocery List</Text>
          <Text style={styles.subtitle}>{totalCount} items from this week's plan</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddInput(!showAddInput)} accessibilityLabel={showAddInput ? 'Close add item' : 'Add item'} accessibilityRole="button">
            <Ionicons name={showAddInput ? 'close' : 'add'} size={20} color={Colors.accent} />
          </TouchableOpacity>
          {checkedCount > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearCheckedGrocery} accessibilityLabel={`Clear ${checkedCount} checked items`} accessibilityRole="button">
              <Text style={styles.clearButtonText}>Clear ({checkedCount})</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showAddInput && (
        <View style={styles.addInputRow}>
          <TextInput
            style={styles.addInput}
            placeholder="Add an item..."
            placeholderTextColor={Colors.textTertiary}
            value={newItemName}
            onChangeText={setNewItemName}
            onSubmitEditing={handleAddItem}
            autoFocus
            returnKeyType="done"
            accessibilityLabel="Item name"
            accessibilityHint="Enter a grocery item to add"
          />
          <TouchableOpacity style={styles.addSubmit} onPress={handleAddItem} accessibilityLabel="Confirm add item" accessibilityRole="button">
            <Ionicons name="checkmark" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {Object.entries(grouped).map(([category, items]) => {
          const catColor = CATEGORY_COLORS[items[0].category] || Colors.textTertiary;
          return (
            <View key={category} style={styles.categoryGroup}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryDot, { backgroundColor: catColor }]} />
                <Text style={[styles.categoryLabel, { color: catColor }]}>{category}</Text>
                <Text style={styles.categoryCount}>{items.length} items</Text>
              </View>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.groceryItem}
                  onPress={() => toggleGroceryItem(item.id)}
                  activeOpacity={0.7}
                  accessibilityLabel={item.ingredientName}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.isChecked }}
                >
                  <View style={[styles.checkbox, item.isChecked && styles.checkboxChecked]}>
                    {item.isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text
                    style={[styles.itemName, item.isChecked && styles.itemNameChecked]}
                    numberOfLines={1}
                  >
                    {item.ingredientName}
                  </Text>
                  <Text style={[styles.itemQuantity, item.isChecked && styles.itemQuantityChecked]}>
                    {item.quantity > 0 ? `${item.quantity} ${item.unit}`.trim() : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {/* Ad banner placeholder */}
        <View style={styles.adBanner}>
          <Text style={styles.adBannerText}>AD BANNER — 320 x 50</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
  },
  title: { fontFamily: 'DM Serif Display', fontSize: 28, letterSpacing: -0.56, color: Colors.textPrimary },
  subtitle: { fontFamily: 'DM Sans', fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  addButton: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  clearButton: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  clearButtonText: { fontFamily: 'DM Sans', fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  addInputRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    marginBottom: 12, gap: 10,
  },
  addInput: {
    flex: 1, height: 44, borderRadius: 12, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14,
    fontFamily: 'DM Sans', fontSize: 15, color: Colors.textPrimary,
  },
  addSubmit: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  list: { flex: 1 },
  // Category groups
  categoryGroup: { marginBottom: 20 },
  categoryHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8,
  },
  categoryDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  categoryLabel: { fontFamily: 'DM Sans', fontSize: 11, fontWeight: '700', letterSpacing: 0.8, flex: 1 },
  categoryCount: { fontFamily: 'DM Sans', fontSize: 12, color: Colors.textTertiary },
  // Grocery items
  groceryItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  checkboxTouchable: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: 4,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  itemName: { flex: 1, fontFamily: 'DM Sans', fontSize: 15, color: Colors.textPrimary },
  itemNameChecked: { textDecorationLine: 'line-through', color: Colors.textTertiary },
  itemQuantity: { fontFamily: 'DM Sans', fontSize: 13, color: Colors.textSecondary },
  itemQuantityChecked: { color: Colors.textTertiary },
  // Ad banner
  adBanner: {
    marginHorizontal: 20, marginTop: 20, paddingVertical: 14,
    borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', backgroundColor: Colors.surface,
  },
  adBannerText: { fontFamily: 'DM Sans', fontSize: 12, color: Colors.textTertiary },
  // Empty state
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontFamily: 'DM Serif Display', fontSize: 24, color: Colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontFamily: 'DM Sans', fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
});
