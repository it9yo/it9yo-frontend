import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity, View, Image, Button,
} from 'react-native';
import { RootStackParamList } from '../@types';

import * as ImagePicker from "react-native-image-picker"

type Props = NativeStackScreenProps<RootStackParamList, 'AdditionalInfo'>;

function CreateCampaign({navigation}) {
    const [title, setTitle] = useState('');
    const [location,setLocation] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [price, setPrice] = useState('');
    const [expectedDevDate, setExpectedDevDate] = useState('');//지역, 인원, 가격, 배송 예정일
    const [introduction, setIntroduction] = useState('');
    const [ img, setImageSource ] = useState("");  // 이미지를 img변수에 할당시킬겁니다!

    const canGoNext = !!title;

    const addImage = () =>{
        const options = {
            title: 'Select Avatar', //이미지 선택할 때 제목입니다 ( 타이틀 ) 
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }], // 선택 버튼을 커스텀 할 수 있습니다.
            storageOptions: {
              skipBackup: true,	// ios인 경우 icloud 저장 여부 입니다!
              path: 'images',
            }
        }
    
        ImagePicker.launchImageLibrary(options, response => {
            console.log("response",response)
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
              setImageSource(response.assets[0].uri); // 저는 여기서 uri 값을 저장 시킵니다 !
            }
        });
      } 

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

          <View style={styles.imageContainer}>
                <Image style={styles.image} source={{uri:img}}/>
                <Button title="이미지 선택" onPress={addImage} ></Button> 
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
              onChangeText={(text) => setLocation(text.trim())}
              // textContentType="telephoneNumber"
              value={location}
              clearButtonMode="while-editing"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>인원</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setTotalAmount(text.trim())}
              // textContentType="telephoneNumber"
              value={totalAmount}
              clearButtonMode="while-editing"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>가격</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setPrice(text.trim())}
              // textContentType="telephoneNumber"
              value={price}
              clearButtonMode="while-editing"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>배송 예정일</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setExpectedDevDate(text.trim())}
              // textContentType="telephoneNumber"
              value={expectedDevDate}
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

    imageContainer:{
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image:{
        width:100,
        height:100,
    },
    container: {
      flex: 1,
      alignItems: 'center',
    },
    inputWrapper: {
      padding: 5,
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
