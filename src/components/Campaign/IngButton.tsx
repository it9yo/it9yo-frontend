import StatusNameList from '@src/constants/statusname';
import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function IngButton({ status } : { status: string }) {
  return <View style={{
    flex: 2, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingRight: 10,
  }}>
    <Text style={{ fontSize: 18, marginRight: 10 }}>
      {status === 'RECRUITING' ? '참여중' : StatusNameList[status]}
    </Text>
    <TouchableOpacity style={styles.button}>
      <Icon name="ios-chatbubble-ellipses-outline" size={28} color="white" />
    </TouchableOpacity>
    {status === 'RECRUITING' && (<TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>취소하기</Text>
    </TouchableOpacity>)
    }
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

export default IngButton;
