import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DragonBackground } from '../../components/common/DragonBackground';

const THEME = {
  primary: '#00ff66',
  accent: '#00d4ff',
  surface: '#0d1b2e',
  text: '#ffffff',
  textDim: '#a0aec0',
  card: '#11223a',
  cardBorder: '#1e3557',
};

const COLUMNS = [
  { id: 'todo', title: 'TODO' },
  { id: 'progress', title: 'IN_PROGRESS' },
  { id: 'review', title: 'REVIEW' },
  { id: 'done', title: 'DONE' },
];

const TASKS = [
  { id: '1', title: 'Initial Nmap Scan', col: 'done', priority: 'High' },
  { id: '2', title: 'Dirb Enumerate', col: 'progress', priority: 'Medium' },
  { id: '3', title: 'SQLMap on login', col: 'todo', priority: 'Critical' },
];

export const ProjectBoardScreen = ({ navigation }: any) => {
  return (
    <DragonBackground overlayOpacity={0.88}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.projectName}>Op_Blacklight</Text>
          <Text style={styles.syncStatus}>SYNC: OK</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.board}>
          {COLUMNS.map(col => (
            <View key={col.id} style={styles.column}>
              <View style={styles.columnHeader}>
                <Text style={styles.columnTitle}>{col.title}</Text>
                <Text style={styles.taskCount}>
                  {TASKS.filter(t => t.col === col.id).length}
                </Text>
              </View>

              <ScrollView style={styles.taskList}>
                {TASKS.filter(t => t.col === col.id).map(task => (
                  <TouchableOpacity 
                    key={task.id} 
                    style={styles.taskCard}
                    onPress={() => navigation.navigate('TaskDetail', { id: task.id })}
                  >
                    <Text style={styles.taskPriority}>[{task.priority}]</Text>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.addTaskBtn}>
                  <Text style={styles.addTaskText}>+ ADD_TASK</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
    </DragonBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  projectName: {
    color: THEME.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 16,
  },
  syncStatus: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  board: {
    flex: 1,
    padding: 10,
  },
  column: {
    width: 280,
    backgroundColor: 'rgba(13, 27, 46, 0.85)',
    marginRight: 15,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    backgroundColor: THEME.card,
  },
  columnTitle: {
    color: THEME.text,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  taskCount: {
    color: THEME.accent,
    fontFamily: 'monospace',
  },
  taskList: {
    padding: 10,
  },
  taskCard: {
    backgroundColor: THEME.card,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderLeftWidth: 3,
    borderLeftColor: THEME.primary,
  },
  taskPriority: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 10,
    marginBottom: 5,
  },
  taskTitle: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  addTaskBtn: {
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0, 255, 102, 0.05)',
  },
  addTaskText: {
    color: THEME.primary,
    fontFamily: 'monospace',
  },
});
