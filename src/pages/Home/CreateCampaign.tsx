import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, View, PermissionsAndroid, Image, Alert,
} from 'react-native';
import React, { useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

function CreateCampaign() {
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDetail, setCampaignDetail] = useState('');
  const [photo, setPhoto] = useState('');

  let options = {
    saveToPhotos: true,
    mediaType: 'photo',
  }

  const oepnGallery = async () => {
    const result = await launchImageLibrary().catch(() => { console.error('!!!') })
    const localUri = result.assets[0].uri;
    const uriPath = localUri.split("//").pop();
    const imageName = localUri.split("/").pop();
    
    setPhoto(localUri);

    console.log(photo)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>상품 명</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setCampaignTitle(text.trim())}
          placeholder="상품명을 입력해주세요"
          placeholderTextColor="#666"
          // textContentType="telephoneNumber"
          value={campaignTitle}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>상품 설명</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setCampaignDetail}
          placeholder="상품 설명을 입력해주세요"
          placeholderTextColor="#666"
          value={campaignDetail}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
        />
      </View>
      <Pressable onPress={oepnGallery} style= {styles.imageAddButton}>
        <Icon name='add-circle' size={60}/>
      </Pressable>
      <Image source={{ uri: photo }}/>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
    inputWrapper: {
      padding: 20,
    },
    label: {
      marginVertical: 5,
      fontSize: 16,
    },
    introduceInput: {
      // lineHeight: 100,
      // borderWidth: StyleSheet.hairlineWidth,
    },
    textInput: {
      width: 300,
      padding: 5,
      marginTop: 5,
      marginRight: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
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
    button: {
        maxWidth: 100,
        paddingVertical: 5,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E2B950',
        borderColor: 'black',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
      },
    imageAddButton: {
        alignItems: 'flex-start',
    }
  });

export default CreateCampaign;
