import { CampaignData } from '@src/@types';
import BackButton from '@src/components/Header/BackButton';
import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CampaignList from './CampaignList';

function Search() {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  const onSearch = () => {
    setTitle(text);
  };

  return <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <BackButton onPress={() => navigation.goBack()}/>
      <TextInput
        style={styles.textInput}
        onChangeText={setText}
        placeholder="검색어 입력"
        placeholderTextColor="#c2c2c2"
        value={text}
        clearButtonMode="while-editing"
        blurOnSubmit={false}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
    </View>
    {title && <CampaignList title={title} />}
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottom: 1,
    borderBottomColor: 'black',
    height: 56,
  },
  textInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    color: '#000',
  },
});
export default Search;
