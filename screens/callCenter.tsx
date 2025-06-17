import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import DownNavbar from './downNavbar';

const CallCenterScreen: React.FC = () => {
  const phonenumber = AsyncStorage.getItem('phoneNumber');
  React.useEffect(() => {
    const fetchPhoneNumber = async () => {
      const value = await AsyncStorage.getItem('phoneNumber');
      console.log(value, 'phonenumber');
    };
    fetchPhoneNumber();
  }, []);

  const handleApiCall = async (option: number) => {
    const apiUrl =
      'https://iqtelephony.airtel.in/gateway/airtel-xchange/v2/execute/workflow';
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    console.log(phoneNumber, 'phoneNumber==============');
    const payload = {
      callFlowId:
        'TUMspyjWoYb+Ul8vp2khpgWZix3lECvaXcJtTQ78KKK6ZrDHJu7L4PH+3GpdB3h+NZote2LjQdUQy1S9rnLnpLO4EZ0yMMDdK9TZynTxHEU=',
      customerId: 'KWIKTSP_CO_Td9yLftfU903GrIZNyxW',
      callType: 'OUTBOUND',
      callFlowConfiguration: {
        initiateCall_1: {
          callerId: '8048248411',
          mergingStrategy: 'SEQUENTIAL',
          participants: [
            {
              participantAddress: phoneNumber || '',
              callerId: '8048248411',
              participantName: 'abc',
              maxRetries: 1,
              maxTime: 360,
            },
          ],
          maxTime: 360,
        },
        addParticipant_1: {
          mergingStrategy: 'SEQUENTIAL',
          maxTime: 360,
          participants: [
            {
              participantAddress:
                option === 1
                  ? '9494999989'
                  : option === 2
                  ? '7093081518'
                  : '9052519059',
              participantName: 'pqr',
              maxRetries: 1,
              maxTime: 360,
            },
          ],
        },
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Basic c21hcnRlcmJpejotaDcySj92MnZUWEsyV1J4',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      // Alert.alert(`Option ${option} API Response`, JSON.stringify(data));
      Alert.alert("Call Initiated, Please wait for the call to connect.");
    } catch (error) {
      Alert.alert('Error', 'Failed to call the API');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://welfarecanteen.in/public/Naval.jpg',
          }}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Call Center</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconborder}>
            <Image
              source={{
                uri: 'https://creazilla-store.fra1.digitaloceanspaces.com/icons/3235242/wallet-icon-sm.png',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconborder}>
            <Image
              source={{
                uri: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.canteenName}>
        Welcome to Welfare Canteen Call Center
      </Text>

      <View style={styles.content}>
        {[1, 2, 3].map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.card,
              {
                backgroundColor:
                  option === 1
                    ? '#e3f2fd'
                    : option === 2
                    ? '#fff3e0'
                    : '#e8f5e9',
              },
            ]}
            onPress={() => handleApiCall(option)}
            activeOpacity={0.85}>
            <Text style={[styles.label, {color: '#0014A8'}]}>
              Call Option {option}
            </Text>
            <Text style={{color: '#555', fontSize: 14, marginTop: 4}}>
              {option === 1
                ? 'Customer Support'
                : option === 2
                ? 'Technical Support'
                : 'General Inquiry'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <DownNavbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'White',
    marginTop: 50,
  },
  canteenName: {
    color: '#0014A8',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0014A8',
    paddingVertical: 20,
    padding: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconborder: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 7,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  card: {
    width: '90%',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  label: {fontSize: 18, fontWeight: 'bold', marginBottom: 8},
});

export default CallCenterScreen;
