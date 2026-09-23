import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
  card: '#1a212d',
};

const PROJECTS = [
  { id: '1', name: 'Op_Blacklight', type: 'Personal', members: 1, updated: '2h ago' },
  { id: '2', name: 'Corp_Audit_Q3', type: 'Shared', members: 4, updated: '1d ago' },
];

export const ProjectListScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput 
          style={styles.searchInput}
          placeholder="[ SEARCH_PROJECTS ]"
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterTabs}>
        {['All', 'Personal', 'Shared'].map(tab => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, filter === tab && styles.activeTab]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={PROJECTS.filter(p => filter === 'All' || p.type === filter)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.projectCard}
            onPress={() => navigation.navigate('ProjectBoard', { id: item.id })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.projectName}>{item.name}</Text>
              <Text style={styles.projectType}>{item.type}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.metaText}>MEMBERS: {item.members}</Text>
              <Text style={styles.metaText}>UPDATED: {item.updated}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  searchBar: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    color: THEME.text,
    fontFamily: 'monospace',
  },
  filterTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: THEME.primary,
  },
  tabText: {
    color: '#888',
    fontFamily: 'monospace',
  },
  activeTabText: {
    color: THEME.primary,
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  projectCard: {
    backgroundColor: THEME.card,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  projectName: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectType: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: THEME.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: THEME.background,
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});
