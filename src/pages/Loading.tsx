import React from 'react';
import {
  SafeAreaView, StyleSheet, Text,
} from 'react-native';

function Loading() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 20 }}>잠시만 기다려주세요...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loading;
