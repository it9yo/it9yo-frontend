import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, View, Image, Alert, Platform, ScrollView,
} from 'react-native';

import { format } from 'date-fns';
import ko from 'date-fns/esm/locale/ko/index.js';

import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';

import axios from 'axios';
import Config from 'react-native-config';

import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import { CommonActions } from '@react-navigation/native';

interface Preview {
  key: string | undefined;
  uri: string;
}

interface ImageData {
  key: string | undefined;
  name: string;
  type: string;
  uri: string;
}

function CreateCampaign({ navigation, route }) {
  const accessToken = useRecoilState(userAccessToken)[0];

  const [images, setImages] = useState<ImageData[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [siDo, setSiDo] = useState('');
  const [siGunGu, setSiGunGu] = useState('');
  const [eupMyeonDong, setEupMyeonDong] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [deadLine, setDeadLine] = useState(new Date());
  const [minQuantityPerPerson, setMinQuantity] = useState('1');
  const [maxQuantityPerPerson, setMaxQuantity] = useState('');
  const [campaignCategory, setCategory] = useState('FOOD');
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState('');

  const [loading, setLoading] = useState(false);

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

  const onCreateCampaign = async () => {
    // TODO: 유효성 검사
    console.log(title, typeof title);
    console.log(tags, typeof tags);
    console.log(description, typeof description);
    console.log(Number(itemPrice), typeof Number(itemPrice));
    console.log(siDo, typeof siDo);
    console.log(siGunGu, typeof siGunGu);
    console.log(eupMyeonDong, typeof eupMyeonDong);
    console.log(detailAddress, typeof detailAddress);
    const stringDeadLine = deadLine.toISOString().split('T')[0];
    console.log(stringDeadLine, typeof stringDeadLine);
    console.log(Number(maxQuantityPerPerson), typeof Number(maxQuantityPerPerson));
    console.log(Number(minQuantityPerPerson), typeof Number(minQuantityPerPerson));
    console.log(campaignCategory, typeof campaignCategory);
    console.log(accessToken);
    if (images.length === 0) {
      Alert.alert('알림', '사진을 추가해 주세요');
      return;
    }
    if (!loading) {
      setLoading(true);
      try {
        const formData = new FormData();
        const request = {
          title,
          tags,
          description,
          itemPrice: Number(itemPrice),
          siDo,
          siGunGu,
          eupMyeonDong,
          detailAddress,
          deadLine: deadLine.toISOString().split('T')[0],
          maxQuantityPerPerson: Number(maxQuantityPerPerson),
          minQuantityPerPerson: Number(minQuantityPerPerson),
          campaignCategory,
        };

        formData.append('request', JSON.stringify(request));

        images.map((image) => {
          const { name, type, uri } = image;
          return formData.append('files', { name, type, uri });
        });

        const response = await axios.post(
          `${Config.API_URL}/campaign/add/v2`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (response.status === 200) {
          Alert.alert('알림', '캠페인 등록이 완료되었습니다.');
          navigation.dispatch(CommonActions.goBack());
          // navigation.navigate('Home');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const onPressDate = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
  };

  const onConfirm = (selectedDate) => {
    setVisible(false);
    setDeadLine(selectedDate);
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
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
      });

      if (response.length > 0) {
        console.log(response);
        response.map(async (item) => {
          const priviewUri = `data:${item.mime};base64,${item.data}`;
          const isImageExist = previews.filter((preview) => preview.uri === priviewUri);
          if (!isImageExist.length) {
            setPreviews((prev) => [...prev, { key: item.localIdentifier, uri: priviewUri }]);
            const resizedImage = await ImageResizer.createResizedImage(
              item.path,
              300,
              300,
              item.mime.includes('jpeg') ? 'JPEG' : 'PNG',
              100,
            );
            console.log(item);
            console.log(resizedImage);
            setImages((prev) => [...prev, {
              key: item.localIdentifier,
              name: resizedImage.name,
              type: item.mime,
              uri: Platform.OS === 'android' ? resizedImage.uri : resizedImage.uri.replace('file://', ''),
            }]);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteImage = (key: string) => {
    Alert.alert(
      '알림',
      '해당 이미지를 삭제하겠습니까?',
      [
        {
          text: '예',
          onPress: () => {
            setPreviews((prevPreviews) => prevPreviews.filter((preview) => preview.key !== key));
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
      <ScrollView style={styles.scrollContainer}>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>대표사진</Text>
          <View style={styles.images}>
            <ScrollView horizontal={true}>
              {previews && previews.map((preview) => {
                const { key, uri } = preview;
                return <Pressable key={key} onPress={() => onDeleteImage(key)}>
                  <Image style={styles.image} source={{ uri }}/>
                </Pressable>;
              })}
              <Pressable onPress={onAddImage} style={styles.imageAddButton}>
                <Text style={styles.add}>+</Text>
                <Text style={styles.addText}>사진(0/5)</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setTitle}
            placeholder="제목 입력"
            placeholderTextColor="#c2c2c2"
            value={title}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
            />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>가격</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setItemPrice}
            placeholder="가격을 입력해주세요"
            placeholderTextColor="#c2c2c2"
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
            <Text>{format(new Date(deadLine), 'PPP', { locale: ko })}</Text>
          </Pressable>
        </View>
        <DateTimePickerModal
          isVisible={visible}
          mode='date'
          onConfirm={onConfirm}
          onCancel={onCancel}
          date={deadLine} />

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

        <Picker
          selectedValue={campaignCategory}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="식품" value="FOOD" />
          {/* <Picker.Item label="의류" value="clothes" />
          <Picker.Item label="전자기기" value="electronic" />
          <Picker.Item label="아동용품" value="baby" />
          <Picker.Item label="도서" value="book" />
          <Picker.Item label="기타" value="etc" /> */}
        </Picker>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>태그</Text>
          <View>
            {tags?.map((_tag) => <Text key={_tag}>{`#${_tag} `}</Text>)}
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
          {/* TODO */}
          {/* {tag
            ? <Pressable style={styles.buttonActive} onPress={onAddTag}>
            <Text style={styles.buttonText}>태그 추가</Text>
          </Pressable>
            : <Pressable style={styles.button}>
          <Text style={styles.buttonText}>태그 추가</Text>
          </Pressable>} */}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>상품 설명</Text>
          <TextInput
            style={styles.introduceInput}
            onChangeText={setDescription}
            placeholder="상품 설명 입력"
            placeholderTextColor="#c2c2c2"
            value={description}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
            multiline={true}
          />
        </View>

      </ScrollView>

      <Pressable
        style={StyleSheet.compose(styles.button, styles.buttonActive)}
        onPress={onCreateCampaign}
      >
        <Text style={styles.buttonText}>공동구매 등록</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  inputWrapper: {
    marginTop: 20,
  },
  images: {
    flexDirection: 'row',
    marginTop: 20,
    height: 100,
    alignItems: 'center',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    backgroundColor: 'gray',
  },
  add: {
    fontFamily: 'NotoSansKR',
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 27.5,
    letterSpacing: -1,
    textAlign: 'left',
    color: '#404040',
  },
  addText: {
    fontFamily: 'NotoSansKR',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 16.5,
    letterSpacing: -1,
    textAlign: 'center',
    color: '#404040',
  },
  label: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#3b3b3b',
  },
  textInput: {
    flex: 1,
    height: 48,
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d3d3d3',
  },
  introduceInput: {
    flex: 1,
    minHeight: 126,
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    textAlignVertical: 'top',
    paddingVertical: 20,
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
  imageAddButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#f6f6f6',
  },
  separator: {
    width: 3,
  },
});

export default CreateCampaign;
