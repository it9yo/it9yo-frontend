import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

function CampaignJoinButton() {
  return <View style={{
    flex: 2, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingRight: 10,
  }}>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>        공동구매 참여하기        </Text>
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

export default CampaignJoinButton;
