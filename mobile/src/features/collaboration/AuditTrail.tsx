import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Avatar } from '../../components/common/Avatar';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterChips } from '../../components/common/FilterChips';

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: { name: string; avatar?: string };
  actionType: 'create' | 'update' | 'delete' | 'login';
  description: string;
  resource: string;
}

export const AuditTrail: React.FC<{ entries: AuditEntry[]; onRefresh: () => void; refreshing: boolean }> = ({
  entries,
  onRefresh,
  refreshing,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const actionColors = {
    create: '#00ff41',
    update: '#00d4ff',
    delete: '#ff3333',
    login: '#00d4ff',
  };

  const filtered = entries.filter((e) => {
    if (filter !== 'all' && e.actionType !== filter) return false;
    if (query && !e.description.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar onSearch={setQuery} placeholder="Search audit logs..." />
        <FilterChips
          chips={[
            { id: 'all', label: 'All' },
            { id: 'create', label: 'Creates' },
            { id: 'update', label: 'Updates' },
            { id: 'delete', label: 'Deletes' },
          ]}
          selectedIds={[filter]}
          onToggle={setFilter}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00ff41" />}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Avatar size="sm" src={item.user.avatar} initials={item.user.name[0]} />
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={styles.username}>{item.user.name}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
              <Text style={styles.desc}>
                <Text style={{ color: actionColors[item.actionType], fontWeight: 'bold' }}>
                  [{item.actionType.toUpperCase()}]
                </Text>{' '}
                {item.description}
              </Text>
              <Text style={styles.resource}>{item.resource}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e14' },
  header: { padding: 16, gap: 12 },
  entry: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2530',
  },
  content: { flex: 1, marginLeft: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  username: { color: '#e0e0e0', fontWeight: 'bold' },
  timestamp: { color: '#aaa', fontSize: 12 },
  desc: { color: '#ccc', fontSize: 14, marginBottom: 4 },
  resource: { color: '#666', fontSize: 12, fontFamily: 'monospace' },
});
