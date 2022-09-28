import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, View, Image, Alert, Platform, ScrollView, Modal, Button,
} from 'react-native';

import { format } from 'date-fns';
import ko from 'date-fns/esm/locale/ko/index.js';

import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Config from 'react-native-config';

import { ImageData } from '@src/@types';
import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';

interface Preview {
  key: number;
  uri: string;
}

function CreateCampaign({ navigation, route }) {
  const accessToken = useRecoilState(userAccessToken)[0];

  const [images, setImages] = useState<ImageData[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [imageKey, setImageKey] = useState(0);
  const [visible, setVisible] = useState(false);
  const [date, onChangeDate] = useState(new Date());

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [siDo, setSiDo] = useState('');
  const [siGunGu, setSiGunGu] = useState('');
  const [eupMyeonDong, setEupMyeonDong] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [deadLine, setDeadLine] = useState('');
  const [minQuantityPerPerson, setMinQuantity] = useState('1');
  const [maxQuantityPerPerson, setMaxQuantity] = useState('');
  const [campaignCategory, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState('');

  useEffect(() => {
    if (route.params?.data) {
      console.log(route.params.data);
      const {
        sido, sigungu, bname, address,
      } = route.params.data;
      setSiDo(sido);
      setSiGunGu(sigungu);
      setEupMyeonDong(bname);
      setDetailAddress(address);
    }
  }, [route.params?.data]);

  const onPressDate = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
  };

  const onConfirm = (selectedDate) => {
    setVisible(false);
    onChangeDate(selectedDate);
  };

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

  const onAddTag = () => {
    setTags((prev) => [...prev, tag]);
    setTag('');
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
            onChangeText={setTitle}
            placeholder="상품명을 입력해주세요"
            placeholderTextColor="#666"
            value={title}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>상품 설명</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setDescription}
            placeholder="상품 설명을 입력해주세요"
            placeholderTextColor="#666"
            value={description}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>가격(1개당)</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setItemPrice}
            placeholder="가격을 입력해주세요"
            placeholderTextColor="#666"
            value={itemPrice}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>주소</Text>
          <TextInput
            style={styles.textInput}
            value={detailAddress}
            editable={false}
          />
          <Pressable onPress={() => navigation.navigate('SearchAddress')}>
            <Text>주소찾기</Text>
          </Pressable>
        </View>

        {/* TODO: 날짜 선택 */}
        {/* <View style={styles.inputWrapper}>
          <Text style={styles.label}>마감 날짜</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setDeadLine}
            placeholder="마감날짜를 입력해주세요"
            placeholderTextColor="#666"
            value={deadLine}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
          />
        </View> */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>마감 날짜</Text>
          <Pressable onPress={onPressDate}>
            <Text>{format(new Date(date), 'PPP', { locale: ko })}</Text>
          </Pressable>
        </View>
        <DateTimePickerModal
          isVisible={visible}
          mode='date'
          onConfirm={onConfirm}
          onCancel={onCancel}
          date={date} />

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>인당 최소 구매 개수(기본 1)</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setMinQuantity}
            placeholder="최소 구매 개수를 입력해주세요"
            placeholderTextColor="#666"
            value={minQuantityPerPerson}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>인당 최대 구매 개수</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setMaxQuantity}
            placeholder="최대 구매 개수를 입력해주세요"
            placeholderTextColor="#666"
            value={maxQuantityPerPerson}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>카테고리</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setMaxQuantity}
            placeholder="카테고리를 선택해주세요"
            placeholderTextColor="#666"
            value={maxQuantityPerPerson}
            // clearButtonMode="while-editing"
            blurOnSubmit={false}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>태그</Text>
          <View>
            {tags?.map((_tag) => <Text>{`#${_tag} `}</Text>)}
          </View>
          <TextInput
            style={styles.textInput}
            onChangeText={setTag}
            placeholder="태그를 입력해주세요"
            placeholderTextColor="#666"
            value={tag}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
          />
          {tag
            ? <Pressable style={styles.buttonActive} onPress={onAddTag}>
            <Text style={styles.buttonText}>태그 추가</Text>
          </Pressable>
            : <Pressable style={styles.button}>
          <Text style={styles.buttonText}>태그 추가</Text>
          </Pressable>}
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
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonActive: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 5,
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
  separator: {
    width: 3,
  },
});

export default CreateCampaign;
