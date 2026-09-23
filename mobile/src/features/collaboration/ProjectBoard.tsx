import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee?: string;
}

export const ProjectBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Initial Reconnaissance', status: 'done', assignee: 'Alice' },
    { id: '2', title: 'Port Scanning', status: 'in_progress', assignee: 'Bob' },
    { id: '3', title: 'Vulnerability Assessment', status: 'todo' }
  ]);

  const renderColumn = (status: Task['status'], title: string) => {
    const columnTasks = tasks.filter(t => t.status === status);
    
    return (
      <View style={styles.column}>
        <Text style={styles.columnTitle}>{title} ({columnTasks.length})</Text>
        <ScrollView style={styles.taskList}>
          {columnTasks.map(task => (
            <TouchableOpacity key={task.id} style={styles.taskCard}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              {task.assignee && (
                <Text style={styles.assignee}>@{task.assignee}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {renderColumn('todo', 'TO DO')}
        {renderColumn('in_progress', 'IN PROGRESS')}
        {renderColumn('done', 'DONE')}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
  },
  column: {
    width: 300,
    marginHorizontal: 10,
    backgroundColor: '#1F2833',
    borderRadius: 8,
    padding: 10,
  },
  columnTitle: {
    color: '#66FCF1',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  taskList: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#45A29E',
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  assignee: {
    color: '#00FF41',
    fontSize: 12,
    marginTop: 8,
  }
});
