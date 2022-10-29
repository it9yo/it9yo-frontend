import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function CancelButton() {
  return <View style={{
    flex: 2, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingRight: 10,
  }}>
    <Text style={{ fontSize: 18, marginRight: 10 }}>참여중</Text>
    <TouchableOpacity style={styles.button}>
      <Icon name="ios-chatbubble-ellipses-outline" size={28} color="white" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>취소하기</Text>
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

export default CancelButton;
