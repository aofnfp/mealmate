import React, { useState, useMemo, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  Pressable
} from "react-native";
import HamburgerHeader from "@/components/HamburgerHeader";
import { useTheme } from '@/store/theme-context';
import { useFocusFlow } from "@/store/focusflow-context";
import { 
  Search, 
  Plus, 
  Clock, 
  Calendar, 
  Edit2, 
  Trash2, 
  X, 
  ArrowUpDown,
  GitMerge,
  ChevronDown,
  Tag as TagIcon
} from "lucide-react-native";
import type { Tag as TagType } from "@/types";
import { TAG_COLORS } from "@/types";

type SortOption = 'alpha' | 'recent' | 'time';

export default function TagsScreen() {
  const { colors } = useTheme();
  const { tags, addTag, updateTag, deleteTag, selectedTagId } = useFocusFlow();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>('alpha');
  const [isReordering, setIsReordering] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isMergeModalVisible, setIsMergeModalVisible] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [editTagName, setEditTagName] = useState("");
  const [editTagColor, setEditTagColor] = useState("");
  const [mergeSourceTags, setMergeSourceTags] = useState<string[]>([]);
  const [mergeTargetTag, setMergeTargetTag] = useState<string | null>(null);
  const [reorderedTags, setReorderedTags] = useState<TagType[]>([]);

  // Sort and filter tags
  const sortedAndFilteredTags = useMemo(() => {
    let result = [...tags];
    
    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    if (!isReordering) {
      switch (sortOption) {
        case 'alpha':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'recent':
          result.sort((a, b) => {
            const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
            const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
            return dateB - dateA;
          });
          break;
        case 'time':
          result.sort((a, b) => b.totalMinutes - a.totalMinutes);
          break;
      }
    } else {
      // Use reordered tags when in reordering mode
      result = reorderedTags.length > 0 ? reorderedTags : result;
    }
    
    return result;
  }, [tags, searchQuery, sortOption, isReordering, reorderedTags]);

  // Format time display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Format date display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never used";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      Alert.alert("Error", "Please enter a tag name");
      return;
    }

    const result = await addTag(newTagName.trim(), newTagColor);
    if (result) {
      setNewTagName("");
      setNewTagColor(TAG_COLORS[0]);
      setIsAddModalVisible(false);
    } else {
      Alert.alert("Error", "Tag already exists");
    }
  };

  const handleEditTag = async () => {
    if (!editingTag || !editTagName.trim()) {
      Alert.alert("Error", "Please enter a tag name");
      return;
    }

    await updateTag(editingTag.id, { 
      name: editTagName.trim(), 
      color: editTagColor,
      // Preserve existing data
      sessions: editingTag.sessions,
      totalMinutes: editingTag.totalMinutes,
      createdAt: editingTag.createdAt,
      lastUsed: editingTag.lastUsed
    });
    setEditingTag(null);
    setEditTagName("");
    setEditTagColor("");
    setIsEditModalVisible(false);
  };

  const handleDeleteTag = (tag: TagType) => {
    Alert.alert(
      "Delete Tag?",
      `Deleting "${tag.name}" does not remove historical sessions. You can reassign them later.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteTag(tag.id)
        }
      ]
    );
  };

  const handleMergeTags = async () => {
    if (mergeSourceTags.length === 0 || !mergeTargetTag) {
      Alert.alert("Error", "Please select source tags and a target tag");
      return;
    }

    if (mergeSourceTags.includes(mergeTargetTag)) {
      Alert.alert("Error", "Target tag cannot be one of the source tags");
      return;
    }

    // Find target tag
    const targetTag = tags.find(t => t.id === mergeTargetTag);
    if (!targetTag) return;

    // Calculate merged stats
    let totalSessions = targetTag.sessions;
    let totalMinutes = targetTag.totalMinutes;
    
    for (const sourceId of mergeSourceTags) {
      const sourceTag = tags.find(t => t.id === sourceId);
      if (sourceTag) {
        totalSessions += sourceTag.sessions;
        totalMinutes += sourceTag.totalMinutes;
      }
    }

    // Update target tag with merged stats
    await updateTag(mergeTargetTag, {
      sessions: totalSessions,
      totalMinutes: totalMinutes,
      lastUsed: new Date().toISOString()
    });

    // Delete source tags
    for (const sourceId of mergeSourceTags) {
      await deleteTag(sourceId);
    }

    // Reset merge state
    setMergeSourceTags([]);
    setMergeTargetTag(null);
    setIsMergeModalVisible(false);
    
    Alert.alert("Success", "Tags merged successfully");
  };

  const toggleReorderMode = () => {
    if (!isReordering) {
      setReorderedTags([...tags]);
    }
    setIsReordering(!isReordering);
  };

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    const newOrder = [...reorderedTags];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setReorderedTags(newOrder);
  }, [reorderedTags]);

  const openEditModal = (tag: TagType) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
    setEditTagColor(tag.color || TAG_COLORS[0]);
    setIsEditModalVisible(true);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      fontSize: 16,
      color: colors.textPrimary,
    },
    addButton: {
      width: 48,
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 100,
    },
    emptyIcon: {
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.textPrimary,
      marginTop: 16,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: "center",
      paddingHorizontal: 32,
    },
    emptyAddButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 24,
      marginTop: 24,
    },
    emptyAddButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600" as const,
    },
    tagsList: {
      paddingBottom: 24,
    },
    tagCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    tagHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    tagIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    tagName: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600" as const,
      color: colors.textPrimary,
    },
    tagActions: {
      flexDirection: "row",
      gap: 8,
    },
    actionButton: {
      padding: 8,
    },
    tagStats: {
      flexDirection: "row",
      gap: 16,
    },
    tagStatsText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    statText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 24,
      paddingBottom: Platform.OS === "ios" ? 40 : 24,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.textPrimary,
    },
    modalInput: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.outline,
      marginBottom: 24,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 12,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: "#B8B8B8",
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: "#FFFFFF",
    },
    confirmButton: {
      backgroundColor: "#B4D66C",
    },
    confirmButtonText: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: "#FFFFFF",
    },
    colorDot: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 12,
      borderWidth: 2,
      borderColor: colors.surface,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    emptyIconContainer: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 8,
    },
    emptyDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      opacity: 0.6,
    },
    colorPickerGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 24,
      marginHorizontal: -4,
    },
    colorOption: {
      width: 48,
      height: 48,
      borderRadius: 24,
      margin: 8,
      borderWidth: 3,
      borderColor: "transparent",
    },
    colorOptionSelected: {
      borderColor: colors.textPrimary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    searchSection: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    toolbar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    sortControl: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 2,
    },
    sortOption: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    sortOptionActive: {
      backgroundColor: colors.surface,
    },
    sortOptionText: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.textSecondary,
    },
    sortOptionTextActive: {
      color: colors.primary,
    },
    toolbarActions: {
      flexDirection: "row",
      gap: 8,
    },
    toolbarButton: {
      padding: 8,
      borderRadius: 8,
    },
    toolbarButtonActive: {
      backgroundColor: colors.background,
    },
    tagContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    tagInfo: {
      flex: 1,
    },
    modalDialog: {
      backgroundColor: colors.surface,
      margin: 20,
      borderRadius: 20,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalField: {
      marginBottom: 20,
    },
    modalLabel: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    tagPickerList: {
      maxHeight: 150,
      borderRadius: 12,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    tagPickerItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    tagPickerItemSelected: {
      backgroundColor: 'rgba(46, 134, 171, 0.1)',
    },
    tagPickerItemText: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
      marginLeft: 8,
    },
    colorDotSmall: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
    checkmark: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    checkmarkText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: "700" as const,
    },
    warningBox: {
      backgroundColor: `${colors.danger}10`,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    warningText: {
      fontSize: 14,
      color: colors.danger,
      lineHeight: 20,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <HamburgerHeader title="Tags" />
      
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tags…"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.sortControl}>
          <TouchableOpacity 
            style={[styles.sortOption, sortOption === 'alpha' && styles.sortOptionActive]}
            onPress={() => setSortOption('alpha')}
          >
            <Text style={[styles.sortOptionText, sortOption === 'alpha' && styles.sortOptionTextActive]}>A–Z</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortOption, sortOption === 'recent' && styles.sortOptionActive]}
            onPress={() => setSortOption('recent')}
          >
            <Text style={[styles.sortOptionText, sortOption === 'recent' && styles.sortOptionTextActive]}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortOption, sortOption === 'time' && styles.sortOptionActive]}
            onPress={() => setSortOption('time')}
          >
            <Text style={[styles.sortOptionText, sortOption === 'time' && styles.sortOptionTextActive]}>Time</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.toolbarActions}>
          <TouchableOpacity 
            style={[styles.toolbarButton, isReordering && styles.toolbarButtonActive]}
            onPress={toggleReorderMode}
          >
            <ArrowUpDown size={20} color={isReordering ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={() => setIsMergeModalVisible(true)}
          >
            <GitMerge size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tags List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sortedAndFilteredTags.length === 0 ? (
          <View style={styles.emptyState}>
            <TagIcon size={48} color={colors.textSecondary} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? "No tags found" : "No tags yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? "Try a different search" : "Create your first tag to organize sessions."}
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={styles.emptyAddButton}
                onPress={() => setIsAddModalVisible(true)}
              >
                <Text style={styles.emptyAddButtonText}>Create Tag</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.tagsList}>
            {sortedAndFilteredTags.map((tag, index) => (
              <Pressable 
                key={tag.id} 
                style={styles.tagCard}
                onLongPress={() => isReordering && handleReorder(index, index)}
              >
                <View style={styles.tagContent}>
                  <View style={[styles.colorDot, { backgroundColor: tag.color || TAG_COLORS[0] }]} />
                  <View style={styles.tagInfo}>
                    <Text style={styles.tagName}>{tag.name}</Text>
                    <Text style={styles.tagStatsText}>
                      {tag.sessions} sessions • {formatDate(tag.lastUsed)} • Total: {formatTime(tag.totalMinutes)}
                    </Text>
                  </View>
                  <View style={styles.tagActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => openEditModal(tag)}
                    >
                      <Edit2 size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteTag(tag)}
                    >
                      <Trash2 size={18} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Tag Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDialog}>
            <Text style={styles.modalTitle}>New Tag</Text>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., Deep Work"
                placeholderTextColor={colors.textSecondary}
                value={newTagName}
                onChangeText={setNewTagName}
                autoFocus
                maxLength={32}
              />
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Color</Text>
              <View style={styles.colorPickerGrid}>
                {['#2E86AB','#A23B72','#F18F01','#2E7D32','#7F8C8D','#6C5CE7','#00B894','#E17055','#0984E3','#E84393'].map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      newTagColor === color && styles.colorOptionSelected
                    ]}
                    onPress={() => setNewTagColor(color)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsAddModalVisible(false);
                  setNewTagName("");
                  setNewTagColor(TAG_COLORS[0]);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddTag}
              >
                <Text style={styles.confirmButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Tag Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Tag</Text>
              <TouchableOpacity onPress={() => {
                setIsEditModalVisible(false);
                setEditingTag(null);
                setEditTagName("");
              }}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter tag name"
                placeholderTextColor={colors.textSecondary}
                value={editTagName}
                onChangeText={setEditTagName}
                autoFocus
                maxLength={32}
              />
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Color</Text>
              <View style={styles.colorPickerGrid}>
                {['#2E86AB','#A23B72','#F18F01','#2E7D32','#7F8C8D','#6C5CE7','#00B894','#E17055','#0984E3','#E84393'].map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      editTagColor === color && styles.colorOptionSelected
                    ]}
                    onPress={() => setEditTagColor(color)}
                  />
                ))}
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.modalButton, styles.confirmButton, { marginTop: 16 }]}
              onPress={handleEditTag}
            >
              <Text style={styles.confirmButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Merge Tags Modal */}
      <Modal
        visible={isMergeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMergeModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Merge Tags</Text>
              <TouchableOpacity onPress={() => {
                setIsMergeModalVisible(false);
                setMergeSourceTags([]);
                setMergeTargetTag(null);
              }}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Source tags (will be deleted)</Text>
              <ScrollView style={styles.tagPickerList}>
                {tags.map((tag) => (
                  <TouchableOpacity
                    key={tag.id}
                    style={[
                      styles.tagPickerItem,
                      mergeSourceTags.includes(tag.id) && styles.tagPickerItemSelected
                    ]}
                    onPress={() => {
                      if (mergeSourceTags.includes(tag.id)) {
                        setMergeSourceTags(mergeSourceTags.filter(id => id !== tag.id));
                      } else {
                        setMergeSourceTags([...mergeSourceTags, tag.id]);
                      }
                    }}
                  >
                    <View style={[styles.colorDotSmall, { backgroundColor: tag.color }]} />
                    <Text style={styles.tagPickerItemText}>{tag.name}</Text>
                    {mergeSourceTags.includes(tag.id) && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Merge into</Text>
              <ScrollView style={styles.tagPickerList}>
                {tags.filter(tag => !mergeSourceTags.includes(tag.id)).map((tag) => (
                  <TouchableOpacity
                    key={tag.id}
                    style={[
                      styles.tagPickerItem,
                      mergeTargetTag === tag.id && styles.tagPickerItemSelected
                    ]}
                    onPress={() => setMergeTargetTag(tag.id)}
                  >
                    <View style={[styles.colorDotSmall, { backgroundColor: tag.color }]} />
                    <Text style={styles.tagPickerItemText}>{tag.name}</Text>
                    {mergeTargetTag === tag.id && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                All sessions from the selected source tags will be reassigned to the target tag. This cannot be undone.
              </Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsMergeModalVisible(false);
                  setMergeSourceTags([]);
                  setMergeTargetTag(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleMergeTags}
              >
                <Text style={styles.confirmButtonText}>Merge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}