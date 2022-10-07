import { userAccessToken } from '@src/states';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text, View, SafeAreaView, StyleSheet, Dimensions,
  useWindowDimensions,
} from 'react-native';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { TabView, SceneMap } from 'react-native-tab-view';

import JoinedList from '@pages/Manage/JoinedList';
import CreatedList from '@pages/Manage/CreatedList';

function Manage() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'joined', title: '참여중' },
    { key: 'created', title: '주최중' },
  ]);

  const renderScene = SceneMap({
    joined: JoinedList,
    created: CreatedList,
  });

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Manage;
