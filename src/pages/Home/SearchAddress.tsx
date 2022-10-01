import React from 'react';
import { SafeAreaView } from 'react-native';
import Postcode from '@actbase/react-daum-postcode';

function SearchAddress({ navigation }) {
  return <SafeAreaView>
    <Postcode
      style={{ width: '100%', height: '100%' }}
      jsOptions={{ animation: true, hideMapBtn: true }}
      onSelected={(data) => navigation.navigate({
        name: 'CreateCampaign',
        params: { data },
        merge: true,
      })}
      onError={() => navigation.goBack()}
    />
  </SafeAreaView>;
}

export default SearchAddress;
