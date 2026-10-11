import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';
import rawToolDefinitions from '../../features/tools/configs/toolDefinitions.json';

const THEME = {
  background: '#070f1e', // Mythic Dragon Abyss
  primary: '#00ff66',    // Dragon Emerald Green
  accent: '#00d4ff',     // Dragon Cyan Blue
  surface: '#0d1b2e',    // Dragon Scale Slate
  card: '#11223a',       // Dragon Blue Card
  text: '#ffffff',       // Pure Crisp White
  textMuted: '#8ba8cc',  // Ice Blue Silver
  border: '#163252',
  borderHighlight: '#00ff66',
  error: '#ff2247',
  warning: '#ffb703',
};

export interface CatalogTool {
  keyId: string;
  id: string;
  name: string;
  category: string;
  desc: string;
  command: string;
  root: boolean;
  requiresNetwork: boolean;
}

// Map all tool definitions from JSON and ensure unique keys
const ALL_TOOLS: CatalogTool[] = (rawToolDefinitions as any[]).map((tool, index) => ({
  keyId: `${tool.id}_${tool.category}_${index}`,
  id: tool.id,
  name: tool.name,
  category: tool.category || 'General',
  desc: tool.description || 'Security assessment and auditing utility.',
  command: tool.command || tool.id,
  root: !!tool.requiresRoot,
  requiresNetwork: !!tool.requiresNetwork,
}));

const CATEGORIES = [
  'All',
  'Network',
  'Vulnerability',
  'Exploitation',
  'Web',
  'Wireless',
  'Password',
  'Sniffing',
  'Forensics',
  'Recon',
  'Crypto',
  'Audit',
];

export const ToolCatalogScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isGrid, setIsGrid] = useState(false);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ALL_TOOLS.length };
    ALL_TOOLS.forEach(tool => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ALL_TOOLS.filter(tool => {
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.command.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);
      const matchesCat = activeCategory === 'All' || tool.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  const renderToolItem = ({ item }: { item: CatalogTool }) => {
    if (isGrid) {
      return (
        <View style={styles.gridCard}>
          <TouchableOpacity
            style={styles.gridCardTop}
            onPress={() => navigation.navigate('ToolDetail', { toolId: item.id })}
          >
            <View style={styles.gridHeader}>
              <View style={styles.liveIndicator} />
              <Text style={styles.gridToolName} numberOfLines={1}>{item.name}</Text>
            </View>
            <Text style={styles.gridCommand} numberOfLines={1}>${item.command}</Text>
            <View style={styles.gridBadges}>
              <Text style={styles.gridCategoryBadge}>{item.category.toUpperCase()}</Text>
              {item.root && <Text style={styles.rootBadgeSmall}>ROOT</Text>}
            </View>
            <Text style={styles.gridDesc} numberOfLines={2}>{item.desc}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridRunBtn}
            onPress={() => navigation.navigate('ToolRunner', { tool: item.id, autoRun: true })}
          >
            <Text style={styles.gridRunBtnText}>⚡ RUN</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.toolCard}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ToolDetail', { toolId: item.id })}
        >
          <View style={styles.cardHeader}>
            <View style={styles.nameRow}>
              <View style={styles.liveIndicator} />
              <Text style={styles.toolName}>{item.name}</Text>
              <Text style={styles.cmdBadge}>${item.command}</Text>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.readyBadge}>
                <Text style={styles.readyBadgeText}>⚡ READY</Text>
              </View>
              {item.root && <Text style={styles.rootBadge}>ROOT</Text>}
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.categoryBadge}>{item.category.toUpperCase()}</Text>
            <Text style={styles.networkBadge}>
              {item.requiresNetwork ? 'NET: REQUIRED' : 'NET: LOCAL'}
            </Text>
          </View>

          <Text style={styles.toolDesc} numberOfLines={2}>{item.desc}</Text>
        </TouchableOpacity>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.specsBtn}
            onPress={() => navigation.navigate('ToolDetail', { toolId: item.id })}
          >
            <Text style={styles.specsBtnText}>[ SPECS ]</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.runBtn}
            onPress={() => navigation.navigate('ToolRunner', { tool: item.id, autoRun: true })}
          >
            <Text style={styles.runBtnText}>⚡ RUN TOOL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <DragonBackground overlayOpacity={0.88}>
      <View style={styles.container}>
        {/* Status Header Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusBarLeft}>
            <View style={styles.liveIndicatorLarge} />
            <View>
              <Text style={styles.statusTitle}>ARSENAL // {ALL_TOOLS.length} TOOLS ARMED</Text>
              <Text style={styles.statusSubtitle}>ALL ENGINES CONFIGURED & READY TO RUN</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.quickRunHeaderBtn}
            onPress={() => navigation.navigate('ToolRunner', { tool: 'nmap', autoRun: true })}
          >
            <Text style={styles.quickRunHeaderText}>QUICK RUN</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Tools & Utilities Toolbar */}
        <View style={styles.utilitiesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.utilBtn}
              onPress={() => navigation.navigate('NetworkMap')}
            >
              <Text style={styles.utilBtnText}>🗺️ TOPOLOGY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.utilBtn}
              onPress={() => navigation.navigate('ExploitDB')}
            >
              <Text style={styles.utilBtnText}>🛡️ EXPLOIT DB</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.utilBtn}
              onPress={() => navigation.navigate('CVSSCalculator')}
            >
              <Text style={styles.utilBtnText}>🔢 CVSS 3.1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.utilBtn}
              onPress={() => navigation.navigate('PasswordGen')}
            >
              <Text style={styles.utilBtnText}>🔑 KEY FORGE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.utilBtn}
              onPress={() => navigation.navigate('ScanHistory')}
            >
              <Text style={styles.utilBtnText}>📜 HISTORY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.utilBtn}
              onPress={() => navigation.navigate('CheatSheet')}
            >
              <Text style={styles.utilBtnText}>⚡ CHEAT SHEET</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Search & Layout Toggle */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={`[ SEARCH ${ALL_TOOLS.length} ARSENAL TOOLS... ]`}
            placeholderTextColor="#556"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.toggleBtn} onPress={() => setIsGrid(!isGrid)}>
            <Text style={styles.toggleText}>{isGrid ? '[ LIST ]' : '[ GRID ]'}</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter Chips */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map(cat => {
              const count = categoryCounts[cat] || 0;
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {cat.toUpperCase()} {count > 0 ? `(${count})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Tools Count Indicator */}
        <View style={styles.countBar}>
          <Text style={styles.countText}>
            SHOWING {filteredTools.length} OF {ALL_TOOLS.length} TOOLS
          </Text>
          <Text style={styles.runHintText}>
            TAP [⚡ RUN] TO EXECUTE ANY TOOL IN TERMINAL
          </Text>
        </View>

        {/* Tools List */}
        <FlatList
          key={isGrid ? 'G' : 'L'}
          data={filteredTools}
          numColumns={isGrid ? 2 : 1}
          keyExtractor={item => item.keyId}
          renderItem={renderToolItem}
          contentContainerStyle={styles.listContent}
          initialNumToRender={15}
          maxToRenderPerBatch={20}
          windowSize={10}
        />
      </View>
    </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 102, 0.06)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 102, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  liveIndicatorLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.primary,
    marginRight: 10,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  liveIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: THEME.primary,
    marginRight: 6,
  },
  statusTitle: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusSubtitle: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 9,
    marginTop: 1,
  },
  quickRunHeaderBtn: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderWidth: 1,
    borderColor: THEME.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  quickRunHeaderText: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },
  utilitiesContainer: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(0, 212, 255, 0.04)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(22, 50, 82, 0.5)',
  },
  utilBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    borderRadius: 3,
    marginRight: 6,
  },
  utilBtnText: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    color: THEME.text,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: 'monospace',
    fontSize: 12,
    marginRight: 8,
    borderRadius: 4,
  },
  toggleBtn: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 4,
  },
  toggleText: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: THEME.border,
    backgroundColor: THEME.surface,
    marginRight: 8,
    borderRadius: 14,
  },
  chipActive: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
  },
  chipText: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 10,
  },
  chipTextActive: {
    color: THEME.primary,
    fontWeight: 'bold',
  },
  countBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(13, 27, 46, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(22, 50, 82, 0.6)',
  },
  countText: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
  },
  runHintText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 8,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 25,
  },
  toolCard: {
    backgroundColor: THEME.card,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toolName: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  cmdBadge: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 11,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readyBadge: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
    borderWidth: 1,
    borderColor: THEME.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 6,
  },
  readyBadgeText: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
  },
  rootBadge: {
    backgroundColor: 'rgba(255, 34, 71, 0.2)',
    borderWidth: 1,
    borderColor: THEME.error,
    color: THEME.error,
    fontSize: 9,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    borderRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2,
  },
  categoryBadge: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 10,
  },
  networkBadge: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 9,
  },
  toolDesc: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(22, 50, 82, 0.8)',
    paddingTop: 10,
  },
  specsBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: THEME.border,
    backgroundColor: THEME.surface,
    marginRight: 10,
    borderRadius: 4,
  },
  specsBtnText: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  runBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: THEME.primary,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  runBtnText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Grid Styles
  gridCard: {
    flex: 1,
    backgroundColor: THEME.card,
    margin: 5,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  gridCardTop: {
    padding: 10,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  gridToolName: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  gridCommand: {
    color: THEME.textMuted,
    fontFamily: 'monospace',
    fontSize: 10,
    marginBottom: 4,
  },
  gridBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridCategoryBadge: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 9,
    marginRight: 6,
  },
  rootBadgeSmall: {
    backgroundColor: 'rgba(255, 34, 71, 0.2)',
    borderWidth: 1,
    borderColor: THEME.error,
    color: THEME.error,
    fontSize: 8,
    paddingHorizontal: 3,
    paddingVertical: 1,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    borderRadius: 2,
  },
  gridDesc: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
  },
  gridRunBtn: {
    backgroundColor: THEME.primary,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridRunBtnText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
