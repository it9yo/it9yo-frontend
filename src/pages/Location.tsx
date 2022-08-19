import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Button,
  Pressable,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { RootStackParamList } from '../@types';
import address from '../constants/address';

type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

function Location({ navigation }: Props) {
  const [sido, setSido] = useState<string | null>(null);
  const [sigungu, setSigungu] = useState<string | null>(null);

  const sidoList = Object.keys(address);

  const handleSido = (item) => {
    setSido(item);
    if (item === '세종특별자치시') {
      setSigungu('');
    } else {
      setSigungu(null);
    }
  };

  const canGoNext = sido && sigungu !== null;

  return (
    <View style={styles.container}>
      <View style={styles.textList}>
      {sidoList.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => { handleSido(item); }}>
          <Text style={item === sido
            ? StyleSheet.compose(styles.commonText, styles.selectedText)
            : styles.commonText}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
      </View>
      <View style={styles.textList}>
        {sido !== null && address[sido].map((item, idx) => (
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
        <TouchableOpacity style={StyleSheet.compose(styles.button, styles.buttonActive)}>
          <Text style={styles.buttonText}>이  전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            canGoNext
              ? StyleSheet.compose(styles.button, styles.buttonActive)
              : styles.button
          }
          disabled={!canGoNext}>
          <Text style={styles.buttonText}>지역 인증 하기</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 20,
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
