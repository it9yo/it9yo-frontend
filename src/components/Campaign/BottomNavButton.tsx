import React from 'react';
import CancelButton from './CancelButton';
import JoinButton from './JoinButton';
import StatusChangeButton from './StatusChangeButton';

function BottomNavButton({
  campaignDetail, isHost, inCampaign, onJoinCampaign, onChangeStatus,
}) {
  if (isHost) {
    return <StatusChangeButton
    status={campaignDetail.campaignStatus}
    onChangeStatus={onChangeStatus} />;
  }

  if (inCampaign) {
    return <CancelButton />;
  }
  return <JoinButton
        campaignDetail={campaignDetail}
        onJoinCampaign={onJoinCampaign}
      />;
  { /* 확정 ~ 수령완료 */ }
  { /* <TouchableOpacity style={styles.button}>
            <Icon name="ios-chatbubble-ellipses-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>     수령 완료하기     </Text>
          </TouchableOpacity> */ }

  { /* 완료 후 */ }
  { /* <TouchableOpacity style={styles.button}>
            <Icon style={{ marginHorizontal: 5 }} name="ios-chatbubble-ellipses-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>후기 작성</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>신고</Text>
          </TouchableOpacity> */ }
}

export default BottomNavButton;
