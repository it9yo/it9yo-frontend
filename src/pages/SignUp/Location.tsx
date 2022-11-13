import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useRecoilState } from 'recoil';
import { SignUpParamList } from '@src/@types';
import { signupState } from '@src/states';
import AddressList from '@constants/address';

type Props = NativeStackScreenProps<SignUpParamList, 'Location'>;

function Location({ navigation }: Props) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);

  const [sido, setSido] = useState<string>('');
  const [sigungu, setSigungu] = useState<string>('');

  const sidoList = Object.keys(AddressList);

  const canGoNext = !!sigungu || sido === '세종특별자치시';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>내 지역 선택</Text>
      <View style={styles.subContainer}>

        <ScrollView style={styles.textList}>
          {sidoList.map((item) => (
            <TouchableOpacity
              key={item.toString()}
              onPress={() => {
                setSido(item);
                setSigungu('');
              }}>
              <Text style={item === sido ? styles.selectedText : styles.commonText}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.verticalLine} />

        <ScrollView style={styles.textList}>
          {!!sido && AddressList[sido].map((item) => (
            <TouchableOpacity
            key={item.toString()}
            onPress={() => setSigungu(item)}>
            <Text style={item === sigungu ? styles.selectedText : styles.commonText}>
              {item}
            </Text>
          </TouchableOpacity>
          ))}
        </ScrollView>

      </View>

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
            siDo: sido,
            siGunGu: sigungu,
          });
          navigation.push('LocationCertification');
        }}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 24,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#282828',
    marginTop: 20,
    marginBottom: 40,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 60,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  textList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  commonText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
    marginBottom: 14,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#e27919',
    marginBottom: 14,
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ababab',
  },
  buttonActive: {
    backgroundColor: '#ff9e3e',
  },
  buttonText: {
    width: 180,
    height: 20,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  horizonLine: {
    height: 10,
    backgroundColor: '#e0e0e0',
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default Location;
