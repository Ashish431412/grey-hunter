import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Avatar } from '../../components/common/Avatar';
import { MarkdownRenderer } from '../../components/common/MarkdownRenderer';

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

export const Comments: React.FC<{ comments: Comment[]; onSend: (text: string, replyTo?: string) => void }> = ({
  comments,
  onSend,
}) => {
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<string | undefined>();

  const renderComment = (c: Comment, isReply = false) => (
    <View key={c.id} style={[styles.commentNode, isReply && styles.replyNode]}>
      <Avatar size="sm" initials={c.authorName[0]} src={c.authorAvatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.author}>{c.authorName}</Text>
          <Text style={styles.time}>{c.timestamp}</Text>
        </View>
        <MarkdownRenderer content={c.content} />
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => setReplyTo(c.id)}>
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>
        {c.replies?.map((r) => renderComment(r, true))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list}>{comments.map((c) => renderComment(c))}</ScrollView>
      <View style={styles.inputArea}>
        {replyTo && (
          <View style={styles.replyingTo}>
            <Text style={styles.replyingText}>Replying to comment...</Text>
            <TouchableOpacity onPress={() => setReplyTo(undefined)}>
              <Text style={styles.cancelReply}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment... (Markdown supported)"
            placeholderTextColor="#666"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => {
              if (input.trim()) {
                onSend(input, replyTo);
                setInput('');
                setReplyTo(undefined);
              }
            }}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e14' },
  list: { flex: 1, padding: 16 },
  commentNode: { flexDirection: 'row', marginBottom: 16 },
  replyNode: { marginLeft: 32, marginTop: 12, marginBottom: 0 },
  content: { flex: 1, marginLeft: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  author: { color: '#e0e0e0', fontWeight: 'bold', marginRight: 8 },
  time: { color: '#666', fontSize: 12 },
  actions: { flexDirection: 'row', marginTop: 8 },
  actionText: { color: '#00ff41', fontSize: 12, fontWeight: 'bold' },
  inputArea: { padding: 16, borderTopWidth: 1, borderTopColor: '#1e2530', backgroundColor: '#131820' },
  replyingTo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, padding: 8, backgroundColor: '#1e2530', borderRadius: 4 },
  replyingText: { color: '#aaa', fontSize: 12 },
  cancelReply: { color: '#ff3333', fontSize: 12, fontWeight: 'bold' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#0a0e14', color: '#e0e0e0', padding: 12, borderRadius: 8, minHeight: 40, maxHeight: 100, borderWidth: 1, borderColor: '#1e2530' },
  sendBtn: { marginLeft: 12, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#00ff41', borderRadius: 8 },
  sendText: { color: '#131820', fontWeight: 'bold' },
});
