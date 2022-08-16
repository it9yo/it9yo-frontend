import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View,Image,Button } from 'react-native';
import * as ImagePicker from "react-native-image-picker"

function CampaignRegister() {
    const [ img, setImageSource ] = useState("");  // 이미지를 img변수에 할당시킬겁니다!

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
          console.log(response.assets[0].uri)
        }
    });
  }  
  return (
      
    <View style={styles.container}>
        <Image style={styles.image} source={{uri:img}}/>
      <Button title="이미지 선택" onPress={addImage} ></Button> 
    </View>
  );
}

export default CampaignRegister;


const styles= StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image:{
        width:300,
        height:300,
    }
})