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
}

function MiddleButton({ campaignDetail, setRefresh }: ButtonProps) {
  const navigation = useNavigation();

  const { hostId, campaignId, campaignStatus } = campaignDetail;
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];

  const [isHost, setHost] = useState(false);
  const [inCampaign, setInCampaign] = useState(false);

  const [received, setReceived] = useState(false);

  useEffect(() => {
    const setInfo = async () => {
      if (userInfo.userId === hostId) {
        setHost(true);
      } else {
        const isInCampaign = await axios.get(
          `${Config.API_URL}/campaign/join/in/${campaignId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setInCampaign(isInCampaign.data.data);
      }
    };

    setInfo();
  }, []);

  useEffect(() => {
    const checkReceived = async () => {
      try {
        const response = await axios.get(
          `${Config.API_URL}/campaign/join/receive/${campaignId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (response.status === 200) {
          setReceived(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkReceived();
  }, []);

  return <>
    {isHost
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
      && <ReviewButton campaignDetail={campaignDetail} type="middle" />}
  </>;
}

export default MiddleButton;
