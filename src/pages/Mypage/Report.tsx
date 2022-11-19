import React, { useEffect, useState } from 'react';
import {
  Pressable as TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, View, Image, Alert, Platform, ScrollView,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { Picker } from '@react-native-picker/picker';

import axios from 'axios';
import Config from 'react-native-config';

import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';

import categoryName from '@src/constants/category';

import ImageDelBtn from '@assets/images/imageDelBtn.png';
import { useIsFocused } from '@react-navigation/native';
import { CampaignData } from '@src/@types';

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

const pageSize = 50;

function Report({ navigation, route }) {
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];

  const [campaignList, setCampaignList] = useState<CampaignData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const isFocused = useIsFocused();

  const [images, setImages] = useState<ImageData[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);

  const [campaignCategory, setCategory] = useState();
  const [description, setDescription] = useState('');

  const canGoNext = campaignCategory && description.length > 0;

  useEffect(() => {
    if (isFocused) {
      loadData();
      setInitLoading(false);
    }

    return () => {
      setCampaignList([]);
      setCurrentPage(0);
      setNoMoreData(false);
    };
  }, [isFocused]);

  useEffect(() => {
    console.log('campaignList', campaignList);
  }, [campaignList]);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = `${Config.API_URL}/campaign/joining?size=${pageSize}&page=${currentPage}&sort=createdDate&direction=ASC`;
      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        const {
          content, first, last, number,
        } = response.data.data;
        if (first) {
          setCampaignList([...content]);
        } else {
          setCampaignList((prev) => [...prev, ...content]);
        }
        setCurrentPage(number + 1);
        if (last) {
          setNoMoreData(true);
        } else {
          setNoMoreData(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onReport = () => {
    Alert.alert('알림', '신고 내용 등록이 완료되었습니다.');
    navigation.goBack();
  };

  const onAddImage = async () => {
    try {
      const response = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        multiple: true,
        maxFiles: 5 - previews.length,
        includeExif: true,
        includeBase64: true,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
      });
      if (response.length > 5 - previews.length) {
        Alert.alert('알림', '사진은 최대 5개까지 선택 가능합니다.');
        return;
      }

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
            key: priviewUri,
            name: resizedImage.name,
            type: item.mime,
            uri: Platform.OS === 'android' ? resizedImage.uri : resizedImage.uri.replace('file://', ''),
          }]);
        }
      });
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
            setPreviews((prevPreviews) => prevPreviews.filter((preview) => preview.uri !== key));
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
      <ScrollView style={styles.scrollContainer}>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>신고할 캠페인 선택</Text>
          <View style={{ ...styles.textInput, paddingHorizontal: 2, justifyContent: 'center' }}>
            {/* TODO: 스타일 변경 */}
            <Picker
              style={{
                fontSize: 8,
              }}
              selectedValue={campaignCategory}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="신고할 캠페인을 선택해 주세요" value="" />
              {campaignList.length > 0
                && campaignList.map((item) => (
                  <Picker.Item
                    key={item.campaignId.toString()}
                    label={item.title}
                    value={item.campaignId.toString()} />
                ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>신고사유 선택</Text>
          <View style={{ ...styles.textInput, paddingHorizontal: 2, justifyContent: 'center' }}>
            {/* TODO: 스타일 변경 */}
            <Picker
              style={{
                fontSize: 8,
              }}
              selectedValue={campaignCategory}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="신고 사유를 선택해 주세요" value="" />
              <Picker.Item label="캠페인 지연" value="CAMPAIGN_DELAY" />
              <Picker.Item label="불친절" value="UNKIND" />
              <Picker.Item label="사기" value="SCAM" />
              <Picker.Item label="상품 불량" value="DEFECTIVE_ITEM" />
              <Picker.Item label="기타" value="ETC" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>신고 내용</Text>
          <TextInput
            style={styles.introduceInput}
            onChangeText={setDescription}
            placeholder="신고 내용을 입력해주세요"
            placeholderTextColor="#c2c2c2"
            value={description}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
            multiline={true}
          />
        </View>

        <View style={styles.inputWrapper}>
          <ScrollView style={styles.imageScroll} horizontal={true} persistentScrollbar={true}>
            {previews && previews.map((preview) => {
              const { uri } = preview;
              return <View key={uri} style={{ marginRight: 20, marginTop: 15 }} >
                <Image style={styles.image} source={{ uri }}/>
                <TouchableOpacity style={styles.deleteBadge} onPress={() => onDeleteImage(uri)}>
                  <Image style={styles.imageDeleteButton} source={ImageDelBtn} />
                </TouchableOpacity>
              </View>;
            })}
            <TouchableOpacity onPress={onAddImage} style={styles.imageAddButton}>
              <Text style={styles.add}>+</Text>
              <Text style={styles.addText}>사진({previews.length}/5)</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />

      </ScrollView>

      <TouchableOpacity
        style={canGoNext
          ? StyleSheet.compose(styles.button, styles.buttonActive)
          : styles.button}
        onPress={onReport}
        disabled={!canGoNext}
      >
        <Text style={styles.buttonText}>등록하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 30,
    marginBottom: 60,
  },
  inputWrapper: {
    marginTop: 20,
  },
  imageScroll: {
    paddingVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteBadge: {
    position: 'absolute',
    top: -14,
    right: -14,
    zIndex: 1,
  },
  imageDeleteButton: {
    width: 32,
    height: 32,
  },
  imageAddButton: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#f6f6f6',
  },
  add: {
    fontFamily: 'NotoSansKR',
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: -1,
    color: '#404040',
  },
  addText: {
    fontFamily: 'NotoSansKR',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: -1,
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
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    marginBottom: 10,
    color: '#000',
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
  searchButton: {
    position: 'absolute',
    right: 15,
  },
  addTagButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ababab',
    marginLeft: 10,
  },
  addTagButtonText: {
    fontFamily: 'NotoSansKR',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#fff',
  },
  tag: {
    backgroundColor: 'orange',
    borderRadius: 30,
    marginRight: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginBottom: 5,
  },
});

export default Report;
