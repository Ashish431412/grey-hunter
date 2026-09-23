import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  error,
  placeholder,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor="#666"
        selectionColor="#00FF41"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    color: '#00FF41',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#0B0C10',
    borderWidth: 1,
    borderColor: '#45A29E',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF0033',
  },
  errorText: {
    color: '#FF0033',
    marginTop: 4,
    fontSize: 12,
  },
});
