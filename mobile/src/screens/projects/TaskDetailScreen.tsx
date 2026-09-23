import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const THEME = {
  background: '#0a0e14',
  primary: '#00ff41',
  accent: '#00d4ff',
  surface: '#131820',
  text: '#e0e0e0',
  error: '#ff003c',
};

export const TaskDetailScreen = () => {
  const [title, setTitle] = useState('SQLMap on login');
  const [desc, setDesc] = useState('Run sqlmap with level 3 risk 3 on login.php form.');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.taskId}>TASK_ID: #1042</Text>
        <Text style={styles.status}>IN_PROGRESS</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>TITLE:</Text>
        <TextInput 
          style={styles.inputTitle}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>DESCRIPTION:</Text>
        <TextInput 
          style={styles.inputDesc}
          value={desc}
          onChangeText={setDesc}
          multiline
        />

        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <Text style={styles.label}>PRIORITY:</Text>
            <Text style={styles.valueRed}>CRITICAL</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.label}>ASSIGNEE:</Text>
            <Text style={styles.value}>SYS_OP_01</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>// COMMENTS</Text>
        <View style={styles.commentBox}>
          <Text style={styles.commentAuthor}>SYS_OP_02 [10:24]</Text>
          <Text style={styles.commentText}>Found WAF blocking standard payloads.</Text>
        </View>

        <TextInput 
          style={styles.commentInput}
          placeholder="[ ADD_COMMENT ]"
          placeholderTextColor="#555"
        />

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>COMMIT_CHANGES</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  taskId: {
    color: '#888',
    fontFamily: 'monospace',
  },
  status: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  label: {
    color: THEME.accent,
    fontFamily: 'monospace',
    fontSize: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  inputTitle: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    color: THEME.primary,
    fontFamily: 'monospace',
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
  },
  inputDesc: {
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: '#333',
    color: THEME.text,
    fontFamily: 'monospace',
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  metaGrid: {
    flexDirection: 'row',
    marginTop: 15,
  },
  metaCol: {
    flex: 1,
  },
  value: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  valueRed: {
    color: THEME.error,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: THEME.primary,
    fontFamily: 'monospace',
    marginTop: 25,
    marginBottom: 10,
  },
  commentBox: {
    backgroundColor: THEME.surface,
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: THEME.accent,
    marginBottom: 10,
  },
  commentAuthor: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 10,
    marginBottom: 5,
  },
  commentText: {
    color: THEME.text,
    fontFamily: 'monospace',
  },
  commentInput: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    color: THEME.text,
    padding: 10,
    fontFamily: 'monospace',
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: THEME.primary,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  saveBtnText: {
    color: THEME.background,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});
