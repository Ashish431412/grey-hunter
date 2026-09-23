import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const lines = code.trim().split('\n');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.lang}>{language || 'text'}</Text>
        <TouchableOpacity style={styles.copyBtn}>
          <Text style={styles.copyText}>Copy</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.codeArea}>
          <View style={styles.lineNumbers}>
            {lines.map((_, i) => (
              <Text key={i} style={styles.lineNumber}>
                {i + 1}
              </Text>
            ))}
          </View>
          <View style={styles.codeContent}>
            {lines.map((line, i) => (
              <Text key={i} style={styles.codeText}>
                {line}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d1117',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e2530',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#131820',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2530',
  },
  lang: {
    color: '#8b949e',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  copyBtn: {},
  copyText: {
    color: '#00ff41',
    fontSize: 12,
  },
  codeArea: {
    flexDirection: 'row',
    padding: 12,
  },
  lineNumbers: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#30363d',
    marginRight: 12,
  },
  lineNumber: {
    color: '#8b949e',
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
    textAlign: 'right',
  },
  codeContent: {},
  codeText: {
    color: '#e6edf3',
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});
