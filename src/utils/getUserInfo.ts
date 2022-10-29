import axios from 'axios';
import Config from 'react-native-config';

const getUserInfo = async (accessToken: string) => {
  try {
    const response = await axios.get(
      `${Config.API_URL}/user/info`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default getUserInfo;
