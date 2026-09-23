import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface FilterChip {
  id: string;
  label: string;
}

export interface FilterChipsProps {
  chips: FilterChip[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  multiSelect?: boolean;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  selectedIds,
  onToggle,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {chips.map((chip) => {
        const isSelected = selectedIds.includes(chip.id);
        return (
          <TouchableOpacity
            key={chip.id}
            style={[styles.chip, isSelected && styles.selectedChip]}
            onPress={() => onToggle(chip.id)}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 48,
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1e2530',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedChip: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderColor: '#00ff41',
  },
  text: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  selectedText: {
    color: '#00ff41',
    fontWeight: 'bold',
  },
});
