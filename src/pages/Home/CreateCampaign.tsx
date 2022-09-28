import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, View, PermissionsAndroid, Image, Alert, Platform, ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';

import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Config from 'react-native-config';

import { ImageData } from '@src/@types';

interface Preview {
  key: number;
  uri: string;
}

function CreateCampaign() {
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDetail, setCampaignDetail] = useState('');
  const [images, setImages] = useState<ImageData[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [imageKey, setImageKey] = useState(0);

  const onAddImage = async () => {
    try {
      const response = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        multiple: true,
        maxFiles: 10,
        includeExif: true,
        includeBase64: true,
        compressImageMaxWidth: 800,
        compressImageMaxHeight: 800,
      });

      if (response.length > 0) {
        let key = imageKey;
        response.map((item) => {
          const priviewUri = `data:${item.mime};base64,${item.data}`;
          const isImageExist = previews.filter((preview) => preview.uri === priviewUri);
          if (!isImageExist.length) {
            setPreviews((prev) => [...prev, { key, uri: priviewUri }]);
            const { path, filename, mime } = item;
            setImages((prev) => [...prev, {
              key,
              name: filename || `image_${item.path}`,
              type: mime,
              uri: Platform.OS === 'android' ? path : path.replace('file://', ''),
            }]);
            key += 1;
          }
        });
        setImageKey(key);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteImage = (key: number) => {
    Alert.alert(
      '알림',
      '해당 이미지를 삭제하겠습니까?',
      [
        {
          text: '예',
          onPress: () => {
            console.log(key);
            setPreviews((prevPreviews) => prevPreviews.filter((preview) => {
              console.log(preview, key);
              return preview.key !== key;
            }));
            setImages((prevImages) => prevImages.filter((image) => image.key !== key));
          },
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
              {previews && previews.map((preview) => {
                const { key, uri } = preview;
                return <Pressable onPress={() => onDeleteImage(key)}>
                  <Image style={styles.image} key={key} source={{ uri }}/>
                </Pressable>;
              })}
              <Pressable onPress={onAddImage} style={styles.imageAddButton}>
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
