import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { RootStackParamList } from '../@types';
import address from '../constants/address';

type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

function Location({ navigation }: Props) {
  const [sido, setSido] = useState<string | null>(null);
  const [sigungu, setSigungu] = useState<string | null>(null);

  const sidoList = Object.keys(address);

  return (
    <View style={styles.container}>
      <View style={styles.textList}>
      {sidoList.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => setSido(item)}>
          <Text style={item === sido
            ? styles.selectedText
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
            ? styles.selectedText
            : styles.commonText}>
            {item}
          </Text>
        </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textList:
  {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  commonText: {

  },
});

export default Location;
