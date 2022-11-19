import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Pressable,
  SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useRecoilState } from 'recoil';
import { SignUpParamList } from '@src/@types';
import { signupState } from '@src/states';

import CheckBox from '@react-native-community/checkbox';

type Props = NativeStackScreenProps<SignUpParamList, 'Terms'>;

function Terms({ navigation }: Props) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);

  const [allTerms, setAllTerms] = useState(false);
  const [firstTerm, setFirstTerm] = useState(false);
  const [secondTerm, setSecondTerm] = useState(false);

  const canGoNext = firstTerm;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>잇구요 서비스 이용약관에 </Text>
        <Text style={styles.title}>동의해주세요.</Text>

        <View style={{ height: 40 }} />

        <View style={styles.term}>

          <CheckBox
            tintColors={{
              true: '#ff9e3e',
            }}
            value={firstTerm && secondTerm}
            onValueChange={(newValue) => {
              setFirstTerm(newValue);
              setSecondTerm(newValue);
            }}
          />
          <Pressable onPress={() => {
            setFirstTerm(!(firstTerm && secondTerm));
            setSecondTerm(!(firstTerm && secondTerm));
          }}>
            <Text style={styles.agreeAllText}>모두 동의 (선택 정보 포함)</Text>
          </Pressable>
        </View>

        <View style={styles.horizenLine} />

        <View style={styles.term}>

          <CheckBox
            tintColors={{
              true: '#ff9e3e',
            }}
            value={firstTerm}
            onValueChange={(newValue) => setFirstTerm(newValue)}
          />

          <Pressable onPress={() => { setFirstTerm((prev) => !prev); }}>
            <Text style={styles.termText}>[필수] 만 14세 이상</Text>
          </Pressable>

          <Text style={styles.termDetailButton}>보기</Text>
        </View>
        <View style={styles.term}>

          <CheckBox
            tintColors={{
              true: '#ff9e3e',
            }}
            value={secondTerm}
            onValueChange={(newValue) => setSecondTerm(newValue)}
          />
          <Pressable onPress={() => { setSecondTerm((prev) => !prev); }}>
            <Text style={styles.termText}>[선택] 광고성 정보 수신 및 마케팅 활용 동의</Text>
          </Pressable>

          <Text style={styles.termDetailButton}>보기</Text>

        </View>
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
            agree: true,
          });
          navigation.push('PhoneCertification');
        }}>
        <Text style={styles.buttonText}>동의하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingTop: 20,
    paddingLeft: 30,
  },
  title: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 26,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
  },
  term: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  allCheckBox: {
  },
  agreeAllText: {
    fontFamily: 'Roboto',
    fontSize: 17,
    fontWeight: '300',
    fontStyle: 'normal',
    letterSpacing: 0.05,
    color: '#282828',
  },

  termText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
    marginRight: 5,
  },
  termDetailButton: {
    textDecorationLine: 'underline',
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#595959',
  },

  horizenLine: {
    height: 1,
    backgroundColor: '#f6f6f6',
    marginBottom: 18,
  },

  button: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ababab',
  },
  buttonActive: {
    backgroundColor: '#ff9e3e',
  },
  buttonText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ffffff',
  },
});

export default Terms;
