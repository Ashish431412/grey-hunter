import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';
import { TOOL_DOCS, ToolDoc } from '../../docs/data/toolDocsData';

const THEME = {
  primary: '#00ff66', // Dragon Green
  accent: '#00d4ff',  // Dragon Blue
  white: '#ffffff',
  textDim: '#a0aec0',
  surface: '#0d1b2e',
  card: '#11223a',
  cardBorder: '#1e3557',
  badgeBg: 'rgba(0, 255, 102, 0.12)',
};

type CategoryFilter = 'ALL' | 'NETWORK' | 'WEB' | 'PASSWORD' | 'WIRELESS' | 'REFERENCE';

export const DocsHomeScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');

  const CATEGORIES: CategoryFilter[] = [
    'ALL',
    'NETWORK',
    'WEB',
    'PASSWORD',
    'WIRELESS',
    'REFERENCE',
  ];

  const filteredDocs = useMemo(() => {
    return TOOL_DOCS.filter(doc => {
      const matchesCat =
        selectedCategory === 'ALL' || doc.category === selectedCategory;
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        doc.name.toLowerCase().includes(query) ||
        doc.title.toLowerCase().includes(query) ||
        doc.oneLiner.toLowerCase().includes(query) ||
        doc.badge.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <DragonBackground overlayOpacity={0.88}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>KNOWLEDGE_BASE // DOCS</Text>
          <Text style={styles.headerSub}>
            OFFLINE SECURITY & TOOL MANUALS • {TOOL_DOCS.length} GUIDES
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="[ SEARCH TOOLS, COMMANDS, GUIDES... ]"
            placeholderTextColor="#627d98"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
          keyboardShouldPersistTaps="handled"
        >
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sync & Stats Bar */}
        <View style={styles.statusRow}>
          <View style={styles.offlineBadge}>
            <Text style={styles.offlineText}>✓ OFFLINE READY</Text>
          </View>
          <Text style={styles.countText}>
            SHOWING {filteredDocs.length} OF {TOOL_DOCS.length} MANUALS
          </Text>
        </View>

        {/* Document Cards List */}
        <View style={styles.docList}>
          {filteredDocs.map(doc => (
            <TouchableOpacity
              key={doc.id}
              style={styles.docCard}
              onPress={() => navigation.navigate('DocViewer', { docId: doc.id })}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{doc.badge}</Text>
                </View>
                <Text style={styles.readTime}>{doc.readTime}</Text>
              </View>

              <Text style={styles.docName}>{doc.name}</Text>
              <Text style={styles.docOneLiner}>{doc.oneLiner}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.categoryLabel}>{doc.category}</Text>
                <Text style={styles.readMore}>VIEW MANUAL →</Text>
              </View>
            </TouchableOpacity>
          ))}

          {filteredDocs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>NO MANUALS MATCHED "{search.toUpperCase()}"</Text>
              <TouchableOpacity
                style={styles.clearSearchBtn}
                onPress={() => {
                  setSearch('');
                  setSelectedCategory('ALL');
                }}
              >
                <Text style={styles.clearSearchText}>RESET FILTERS</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSub: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 11,
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 14,
  },
  searchInput: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    color: THEME.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  filterScroll: {
    marginBottom: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderColor: THEME.primary,
  },
  filterText: {
    color: THEME.textDim,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: THEME.primary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  offlineBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: THEME.accent,
  },
  offlineText: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },
  countText: {
    color: THEME.textDim,
    fontFamily: 'monospace',
    fontSize: 11,
  },
  docList: {
    gap: 12,
  },
  docCard: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderLeftWidth: 4,
    borderLeftColor: THEME.primary,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeContainer: {
    backgroundColor: THEME.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 102, 0.3)',
  },
  badgeText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },
  readTime: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 11,
  },
  docName: {
    color: THEME.white,
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  docOneLiner: {
    color: THEME.textDim,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8,
  },
  categoryLabel: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  readMore: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  emptyText: {
    color: THEME.white,
    fontFamily: 'monospace',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  clearSearchBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: THEME.primary,
    backgroundColor: 'rgba(0, 255, 102, 0.1)',
  },
  clearSearchText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
