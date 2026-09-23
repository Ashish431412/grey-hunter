import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CodeBlock } from './CodeBlock';

export interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // A simplistic markdown renderer for demonstration
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      let code = '';
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        code += lines[i] + '\n';
        i++;
      }
      elements.push(<CodeBlock key={`code-${i}`} code={code} language={lang} />);
    } else if (line.startsWith('# ')) {
      elements.push(<Text key={i} style={styles.h1}>{line.slice(2)}</Text>);
    } else if (line.startsWith('## ')) {
      elements.push(<Text key={i} style={styles.h2}>{line.slice(3)}</Text>);
    } else if (line.startsWith('- ')) {
      elements.push(
        <View key={i} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>{line.slice(2)}</Text>
        </View>
      );
    } else if (line.trim() !== '') {
      elements.push(<Text key={i} style={styles.text}>{line}</Text>);
    }
    i++;
  }

  return <View style={styles.container}>{elements}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h1: {
    color: '#e0e0e0',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  h2: {
    color: '#e0e0e0',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  text: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 8,
  },
  bullet: {
    color: '#00ff41',
    marginRight: 8,
    fontSize: 16,
    lineHeight: 24,
  },
});
