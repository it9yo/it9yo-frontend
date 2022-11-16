import { CampaignData } from '@src/@types';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import Config from 'react-native-config';
import axios from 'axios';

import { useNavigation } from '@react-navigation/native';
import JoinButton from './JoinButton';
import CancelButton from './CancelButton';
import ReceiveButton from './ReceiveButton';
import ManageButton from './ManageButton';
import ReviewButton from './ReviewButton';

interface ButtonProps {
  campaignDetail: CampaignData;
  setRefresh: any;
  isHost: boolean;
  inCampaign: boolean;
  received: boolean;
}

function MiddleButton({
  campaignDetail, setRefresh, isHost, inCampaign, received,
}: ButtonProps) {
  const { campaignStatus } = campaignDetail;

  return <>
    {/* {isHost
      && <ManageButton campaignDetail={campaignDetail} type="middle" />}

    {!isHost && !inCampaign
      && <JoinButton
      campaignDetail={campaignDetail}
      setRefresh={setRefresh}
      type="middle" />}

    {!isHost && inCampaign && campaignStatus === 'RECRUITING'
      && <CancelButton
      campaignDetail={campaignDetail}
      setRefresh={setRefresh}
      type="middle" />}

    {!isHost && inCampaign && campaignStatus === 'DISTRIBUTING' && !received
      && <ReceiveButton
      campaignDetail={campaignDetail}
      setRefresh={setRefresh}
      type="middle" />}

    {!isHost && inCampaign && received
      && <ReviewButton campaignDetail={campaignDetail} type="middle" />} */}
      <ReviewButton campaignDetail={campaignDetail} type="middle" />
  </>;
}

export default MiddleButton;
