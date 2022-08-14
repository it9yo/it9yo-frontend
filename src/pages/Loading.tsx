import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function Loading() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>잠시만 기다려주세요...</Text>
    </View>
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
