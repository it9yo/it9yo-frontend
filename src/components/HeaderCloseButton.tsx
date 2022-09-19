import React from 'react';
import { Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function HeaderCloseButton({ text, onPress }: { text?:string, onPress?:()=>void }) {
  return <Pressable style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 2 }} onPress={onPress}>
    <Icon style={{ marginHorizontal: 2 }} name="close" size={24} color="#000" />
    {text && <Text style={{ fontSize: 24, fontWeight: '500' }}>
      {text}
    </Text>}
  </Pressable>;
}

export default HeaderCloseButton;
