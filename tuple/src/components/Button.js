import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/config';

export default function Button({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  style,
  textStyle 
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    backgroundColor: '#ccc',
    elevation: 0,
  },
});

