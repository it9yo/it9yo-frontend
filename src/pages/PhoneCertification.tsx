import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { RootStackParamList } from '../@types';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneCertification'>;

function PhoneCertification({ navigation }: Props) {
  const canGoNext = true;
  return (
    <SafeAreaView style={styles.container}>
      <Text>휴대폰 인증 화면</Text>
      <View style={styles.buttonZone}>
        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.buttonActive)}
          onPress={() => navigation.pop()}>
          <Text style={styles.buttonText}>이  전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            canGoNext
              ? StyleSheet.compose(styles.button, styles.buttonActive)
              : styles.button
          }
          disabled={!canGoNext}
          onPress={() => navigation.push('AdditionalInfo')}>
          <Text style={styles.buttonText}>다음으로</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonZone: {
    position: 'absolute',
    width: '90%',
    bottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  button: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonActive: {
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PhoneCertification;
