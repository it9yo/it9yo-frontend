import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import JoinedCampaignList from '@src/pages/Manage/JoinedCampaignList';
import CreatedCampaignList from '@src/pages/Manage/CreatedCampaignList';

function Manage() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'joined', title: '참여중' },
    { key: 'created', title: '주최중' },
  ]);

  const renderScene = SceneMap({
    joined: JoinedCampaignList,
    created: CreatedCampaignList,
  });

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: "#FF9E3E",
            }}
            style={{
              backgroundColor: "white",
              fontWeight: "bold",
              shadowOffset: { height: 0, width: 0 },
              shadowColor: "transparent"
            }}
            pressColor={"transparent"}
            renderLabel={({ route, focused }) => (
              <Text focused={focused} style={{color: focused? '#FF9E3E' : '#282828'}}>{route.title}</Text>
            )}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'SpoqaHanSansNeo',
    backgroundColor: '#fff',
  },
});

export default Manage;
