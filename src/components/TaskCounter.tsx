import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TASKS } from '../data/tasks';
import { TaskStatus } from '../types/types';

interface Props {
  scheduleId: string;
  taskStatuses: TaskStatus[];
  onTaskToggle: (taskId: string, completed: boolean) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export default function TaskCounter({ 
  scheduleId, 
  taskStatuses, 
  onTaskToggle,
  expanded = false,
  onToggleExpand
}: Props) {
  const scheduleTasks = TASKS.filter(task => task.scheduleIds.includes(scheduleId));
  const requiredTasks = scheduleTasks.filter(task => task.isRequired);
  const optionalTasks = scheduleTasks.filter(task => !task.isRequired);
  
  const completedRequired = requiredTasks.filter(task => 
    taskStatuses.find(status => status.taskId === task.id)?.completed
  ).length;
  
  const completedOptional = optionalTasks.filter(task => 
    taskStatuses.find(status => status.taskId === task.id)?.completed
  ).length;

  const allRequiredCompleted = completedRequired === requiredTasks.length;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.summary}
        onPress={onToggleExpand}
      >
        <View style={styles.counters}>
          <View style={styles.counterItem}>
            <Text style={[
              styles.counterNumber,
              !allRequiredCompleted && styles.counterNumberIncomplete
            ]}>
              {completedRequired}/{requiredTasks.length}
            </Text>
            <Text style={styles.counterLabel}>Obligatorias</Text>
          </View>
          <View style={styles.counterDivider} />
          <View style={styles.counterItem}>
            <Text style={styles.counterNumber}>
              {completedOptional}/{optionalTasks.length}
            </Text>
            <Text style={styles.counterLabel}>Opcionales</Text>
          </View>
        </View>
        <FontAwesome5 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color="#666" 
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.taskList}>
          {requiredTasks.length > 0 && (
            <View key="required">
              <Text style={styles.taskGroupTitle}>Tareas obligatorias</Text>
              {requiredTasks.map(task => {
                const status = taskStatuses.find(s => s.taskId === task.id);
                return (
                  <TouchableOpacity
                    key={`required-${task.id}`}
                    style={styles.taskItem}
                    onPress={() => onTaskToggle(task.id, !status?.completed)}
                  >
                    <View style={styles.taskInfo}>
                      <FontAwesome5 
                        name={task.icon} 
                        size={16} 
                        color="#009D96" 
                        style={styles.taskIcon}
                      />
                      <Text style={styles.taskName}>{task.name}</Text>
                    </View>
                    <FontAwesome5 
                      name={status?.completed ? 'check-circle' : 'circle'} 
                      size={20} 
                      color={status?.completed ? '#4CAF50' : '#ddd'} 
                      solid={status?.completed}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {optionalTasks.length > 0 && (
            <View key="optional">
              <Text style={styles.taskGroupTitle}>Tareas opcionales</Text>
              {optionalTasks.map(task => {
                const status = taskStatuses.find(s => s.taskId === task.id);
                return (
                  <TouchableOpacity
                    key={`optional-${task.id}`}
                    style={styles.taskItem}
                    onPress={() => onTaskToggle(task.id, !status?.completed)}
                  >
                    <View style={styles.taskInfo}>
                      <FontAwesome5 
                        name={task.icon} 
                        size={16} 
                        color="#009D96" 
                        style={styles.taskIcon}
                      />
                      <Text style={styles.taskName}>{task.name}</Text>
                    </View>
                    <FontAwesome5 
                      name={status?.completed ? 'check-circle' : 'circle'} 
                      size={20} 
                      color={status?.completed ? '#4CAF50' : '#ddd'} 
                      solid={status?.completed}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 12,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  counters: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterItem: {
    alignItems: 'center',
  },
  counterDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
  counterNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#009D96',
  },
  counterNumberIncomplete: {
    color: '#FF9800',
  },
  counterLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  taskList: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  taskGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIcon: {
    marginRight: 8,
  },
  taskName: {
    fontSize: 14,
    color: '#333',
  },
}); 