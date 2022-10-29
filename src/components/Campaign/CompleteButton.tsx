import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function CompleteButton() {
  return <View style={{
    flex: 2, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingRight: 10,
  }}>
    <TouchableOpacity style={styles.button}>
      <Icon style={{ marginHorizontal: 5 }} name="ios-chatbubble-ellipses-outline" size={28} color="white" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>후기 작성</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>신고</Text>
    </TouchableOpacity>
  </View>;
}
const styles = StyleSheet.create({
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CompleteButton;
