import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useRecoilState } from 'recoil';
import { RootStackParamList } from '../@types';
import address from '../constants/address';
import { signupState } from '../recoil';

type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

function Location({ navigation }: Props) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);

  const [sido, setSido] = useState<string>('');
  const [sigungu, setSigungu] = useState<string>('');

  const sidoList = Object.keys(address);

  const canGoNext = !!sigungu || sido === '세종특별자치시';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textList}>
      {sidoList.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            setSido(item);
            setSigungu('');
          }}>
          <Text style={item === sido
            ? StyleSheet.compose(styles.commonText, styles.selectedText)
            : styles.commonText}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      </View>
      <View style={styles.textList}>
        {!!sido && address[sido].map((item, idx) => (
          <TouchableOpacity
          key={idx}
          onPress={() => setSigungu(item)}>
          <Text style={item === sigungu
            ? StyleSheet.compose(styles.commonText, styles.selectedText)
            : styles.commonText}>
            {item}
          </Text>
        </TouchableOpacity>
        ))}
      </View>

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
          onPress={() => {
            setSignupInfo({
              ...signupInfo,
              sido,
              sigungu,
            });
            navigation.push('LocationCertification');
          }}>
          <Text style={styles.buttonText}>다음으로</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  textList: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  commonText: {
    marginTop: 8,
    paddingLeft: 12,
    color: 'gray',
    fontSize: 16,
  },
  selectedText: {
    color: 'black',
    fontWeight: 'bold',
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
    height: 40,
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

export default Location;
