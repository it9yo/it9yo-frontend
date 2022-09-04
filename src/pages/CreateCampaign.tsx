import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { RootStackParamList } from '../@types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdditionalInfo'>;

function CreateCampaign({navigation}) {
    const [title, setTitle] = useState('');
    const [introduction, setIntroduction] = useState('');

    const canGoNext = !!title;

    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setTitle(text.trim())}
              // textContentType="telephoneNumber"
              value={title}
              clearButtonMode="while-editing"
              blurOnSubmit={false}
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>상품 소개</Text>
            <TextInput
              style={StyleSheet.compose(styles.textInput, styles.introduceInput)}
              onChangeText={setIntroduction}
              placeholder="상품의 설명을 작성해주세요"
              placeholderTextColor="#666"
              value={introduction}
              clearButtonMode="while-editing"
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>지역</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setTitle(text.trim())}
              // textContentType="telephoneNumber"
              value={title}
              clearButtonMode="while-editing"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>인원</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setTitle(text.trim())}
              // textContentType="telephoneNumber"
              value={title}
              clearButtonMode="while-editing"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>가격</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setTitle(text.trim())}
              // textContentType="telephoneNumber"
              value={title}
              clearButtonMode="while-editing"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>예송 배정일</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setTitle(text.trim())}
              // textContentType="telephoneNumber"
              value={title}
              clearButtonMode="while-editing"
              blurOnSubmit={false}
            />
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
              onPress={() => navigation.push('Location')}>
              <Text style={styles.buttonText}>다음으로</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    inputWrapper: {
      padding: 10,
    },
    label: {
      marginVertical: 5,
    },
    introduceInput: {
      height: 100,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    textInput: {
      width: 300,
      padding: 5,
      marginRight: 10,
      borderRadius: 5,
      borderWidth: StyleSheet.hairlineWidth,
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

export default CreateCampaign;
