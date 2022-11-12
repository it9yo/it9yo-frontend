import React from 'react';
import {
  Text, Pressable, Image, StyleSheet,
} from 'react-native';
import BackBtn from '@assets/images/arrowLeft.png';

function BackButton({ text, onPress }: { text?:string, onPress?:()=>void }) {
  return <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24 }} onPress={onPress}>
    <Image style={styles.button} source={BackBtn}/>
    {text && <Text style={{ color: 'black', fontSize: 24, fontWeight: '500' }}>
      {text}
    </Text>}
  </Pressable>;
}

const styles = StyleSheet.create({
  button: {
    width: 24,
    height: 24,
    backgroundColor: '#ffffff',
  },
});

export default BackButton;
