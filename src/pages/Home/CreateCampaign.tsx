import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, View, PermissionsAndroid, Image, Alert, Platform, ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Config from 'react-native-config';
import MultipleImagePicker, { type Results } from '@baronha/react-native-multiple-image-picker';
import { PhotoData } from '@src/@types';

function CreateCampaign() {
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDetail, setCampaignDetail] = useState('');
  const [photos, setPhotos] = useState<PhotoData[]>([]);

  const onAddPhoto = async () => {
    try {
      const response: Results[] = await MultipleImagePicker.openPicker({
        mediaType: 'image',
        maxSelectedAssets: 10,
      });
      console.log('photos', photos);
      if (response.length > 0) {
        response.map((item) => {
          const { fileName, type } = item;
          const path = Platform.OS === 'android' ? `file:/${item.realPath}` : item.path;
          console.log(item);
          console.log(path);
          const isPhotoExist = photos.filter((photo) => photo.uri === path);
          const photo: PhotoData = {
            name: fileName,
            type,
            uri: path,
          };
          setPhotos((prevPhotos) => [...prevPhotos, photo]);
          // if (!isPhotoExist.length) {
          // }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDeletePhoto = (uri: string) => {
    Alert.alert(
      '알림',
      '해당 이미지를 삭제하겠습니까?',
      [
        {
          text: '예',
          onPress: () => setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.uri !== uri)),
        },
        {
          text: '아니오',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>상품 이미지</Text>
          <View style={styles.images}>
            <ScrollView horizontal={true}>
              {photos && photos.map((photo) => {
                const { uri } = photo;
                console.log(uri);
                return <Pressable onPress={() => onDeletePhoto(uri)}>
                  <Image style={styles.image} key={uri} source={{ uri }}/>
                </Pressable>;
              })}
              <Pressable onPress={onAddPhoto} style={styles.imageAddButton}>
                <Icon name='add-circle' size={60} color={'orange'}/>
              </Pressable>
            </ScrollView>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>상품명</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setCampaignTitle}
            placeholder="상품명을 입력해주세요"
            placeholderTextColor="#666"
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  images: {
    flexDirection: 'row',
    height: 100,
    // backgroundColor: 'white',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    backgroundColor: 'gray',
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    marginVertical: 5,
    fontSize: 16,
    color: 'black',
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
  // button: {
  //   maxWidth: 100,
  //   paddingVertical: 5,
  //   paddingHorizontal: 8,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#E2B950',
  //   borderColor: 'black',
  //   borderWidth: StyleSheet.hairlineWidth,
  //   borderRadius: 5,
  // },
  imageAddButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreateCampaign;
