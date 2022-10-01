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

import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Config from 'react-native-config';

import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';

interface Preview {
  key: string;
  uri: string;
}

interface ImageData {
  key: string;
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
    // TODO: 유효성 검사, loading 처리
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
    try {
      const campaignResponse = await axios.post(
        `${Config.API_URL}/campaign/add`,
        {
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
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (campaignResponse.status === 200) {
        console.log('campaignResponse', campaignResponse);
        // TODO: 사진 유효성 검사
        const { campaignId } = campaignResponse.data.data;
        console.log(campaignId);
        const formData = new FormData();
        images.map((image) => {
          const { name, type, uri } = image;
          formData.append('files', { name, type, uri });
        });
        // console.log(files);
        // formData.append('files', files);
        const imageResponse = await axios.post(
          `${Config.API_URL}/campaign/${campaignId}/addImages`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (imageResponse.status === 200) {
          console.log('imageResponse', imageResponse);
          Alert.alert('알림', '캠페인 등록이 완료되었습니다.');
        }
      }
    } catch (error) {
      console.error(error);
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
        compressImageMaxWidth: 800,
        compressImageMaxHeight: 800,
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
              800,
              800,
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
      <ScrollView>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>상품 이미지</Text>
          <View style={styles.images}>
            <ScrollView horizontal={true}>
              {previews && previews.map((preview) => {
                const { key, uri } = preview;
                return <Pressable key={key} onPress={() => onDeleteImage(key)}>
                  <Image style={styles.image} source={{ uri }}/>
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

        <Pressable style={styles.buttonActive} onPress={onCreateCampaign}>
          <Text style={styles.buttonText}>캠페인 등록하기</Text>
        </Pressable>

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
