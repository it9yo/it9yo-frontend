import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import JoinedChatList from '@pages/Chat/JoinedChatList';
import CreatedChatList from '@pages/Chat/CreatedChatList';

function Chat() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'joined', title: '참여중' },
    { key: 'created', title: '주최중' },
  ]);

  const renderScene = SceneMap({
    joined: JoinedChatList,
    created: CreatedChatList,
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

export default Chat;
