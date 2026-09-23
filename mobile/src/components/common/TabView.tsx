import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export interface Tab {
  key: string;
  title: string;
  content: React.ReactNode;
}

export interface TabViewProps {
  tabs: Tab[];
  initialTab?: string;
}

export const TabView: React.FC<TabViewProps> = ({ tabs, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.key);

  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.content}>{currentTab?.content}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: '#1e2530',
    backgroundColor: '#131820',
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00ff41',
  },
  tabText: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#00ff41',
  },
  content: {
    flex: 1,
  },
});
