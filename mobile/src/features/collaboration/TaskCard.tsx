import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';

export interface TaskCardProps {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  dueDate?: string;
  isOverdue?: boolean;
  labels?: string[];
  assigneeName?: string;
  assigneeAvatar?: string;
  onPress: () => void;
}

const statusColors = {
  TODO: '#666',
  IN_PROGRESS: '#00d4ff',
  REVIEW: '#ffaa00',
  DONE: '#00ff41',
};

const priorityIcons = {
  Critical: '🔥',
  High: '⬆️',
  Medium: '➖',
  Low: '⬇️',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  status,
  priority,
  dueDate,
  isOverdue,
  labels = [],
  assigneeName,
  assigneeAvatar,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.statusStrip, { backgroundColor: statusColors[status] }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.priorityIcon}>{priorityIcons[priority]}</Text>
        </View>

        {labels.length > 0 && (
          <View style={styles.labels}>
            {labels.map((lbl) => (
              <Badge key={lbl} label={lbl} size="sm" variant="outline" />
            ))}
          </View>
        )}

        <View style={styles.footer}>
          {dueDate && (
            <Text style={[styles.dueDate, isOverdue && styles.overdueText]}>
              📅 {dueDate}
            </Text>
          )}
          <View style={{ flex: 1 }} />
          {assigneeName && (
            <Avatar size="sm" src={assigneeAvatar} initials={assigneeName[0]} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131820',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e2530',
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 6,
  },
  statusStrip: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    color: '#e0e0e0',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  priorityIcon: {
    fontSize: 16,
  },
  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  dueDate: {
    color: '#aaa',
    fontSize: 12,
  },
  overdueText: {
    color: '#ff3333',
    fontWeight: 'bold',
  },
});
