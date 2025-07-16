import React, {useState, useCallback} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes';
import Header from './header';
import DownNavbar from './downNavbar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Constants
const COLORS = {
  PRIMARY: '#0014A8',
  TEXT_DARK: '#333',
  TEXT_SECONDARY: '#666',
  BACKGROUND: '#fff',
  BORDER: '#E0E0E0',
  MENU_BG: '#F5F5F5',
  LOGOUT_BG: '#FFF5F5',
  ERROR: '#ff4d4d',
};

// Types
type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SettingsScreen'
>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const handleLogout = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('authorization'),
        AsyncStorage.removeItem('phoneNumber'),
        AsyncStorage.removeItem('canteenId'),
        AsyncStorage.removeItem('selectedDate'),
        AsyncStorage.removeItem('cartId'),
        AsyncStorage.removeItem('itemId'),
        AsyncStorage.removeItem('cartId'),
      ]);
      setIsLoggedIn(false);
      navigation.replace('Login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  }, [navigation]);

  const confirmLogout = useCallback(() => {
    Alert.alert(
      'Confirm Logout',
      'Do you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: handleLogout,
        },
      ],
      {cancelable: true},
    );
  }, [handleLogout]);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <Header text="Settings" />
        <View style={styles.loggedOutContainer}>
          <Text style={styles.loggedOutText}>
            User is logged out. Please log in again.
          </Text>
        </View>
        <DownNavbar style={styles.stckyNavbar} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header text="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ViewOrders')}>
            <Image
              style={styles.profile}
              source={{
                uri: 'https://cdn-icons-png.freepik.com/256/754/754187.png?semt=ais_hybrid',
              }}
            />
            <Text style={styles.menuText}>Orders history</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('WalletScreen')}>
            <Image
              style={styles.profile}
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJQDnF4cAvtdcYSFaPGY1FmFek1kOQfCJvZA&s',
              }}
            />
            <Text style={styles.menuText}>Wallet</Text>
          </TouchableOpacity>
           <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('privacypolicy')}>
            <Image
              style={styles.profile}
              source={{
                uri: 'https://static.thenounproject.com/png/2800747-200.png',
              }}
            />
            <Text style={styles.menuText}>Terms Conditions</Text>
          </TouchableOpacity>

           <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('ContactUs')}>
            <Image
              style={styles.profile}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/455/455705.png',
              }}
            />
            <Text style={styles.menuText}>Contact Us</Text>
          </TouchableOpacity>
        
          
          {/* <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('TermsConditions')}>
            <Image
              style={styles.profile}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2995/2995400.png',
              }}
            />
            <Text style={styles.menuText}>Terms & Conditions</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered By</Text>
          <Text style={styles.footerLogo}>WorldTek.in</Text>
        </View>
      </View>
      <DownNavbar style={styles.stckyNavbar} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loggedOutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  loggedOutText: {
    fontSize: wp('4%'),
    color: COLORS.TEXT_DARK,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: wp('4%'),
    paddingBottom: hp('20%'), // Ensure space for bottom container
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.MENU_BG,
    padding: wp('4%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('2%'),
    borderWidth: wp('0.2%'),
    borderColor: COLORS.BORDER,
  },
  profile: {
    height: wp('8%'),
    width: wp('8%'),
    marginRight: wp('5%'),
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: wp('4%'),
    flex: 1,
    color: COLORS.TEXT_DARK,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: hp('8%'), // Position above navbar
    left: 0,
    right: 0,
    paddingHorizontal: wp('4%'),
    backgroundColor: COLORS.BACKGROUND,
  },
  logoutButton: {
    alignItems: 'center',
    padding: wp('4%'),
    borderRadius: wp('2.5%'),
    borderColor: COLORS.ERROR,
    borderWidth: wp('0.2%'),
    backgroundColor: COLORS.LOGOUT_BG,
    marginBottom: hp('1%'),
  },
  logoutText: {
    color: COLORS.ERROR,
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: hp('1%'),
  },
  footerText: {
    fontSize: wp('3.5%'),
    color: COLORS.TEXT_SECONDARY,
  },
  footerLogo: {
    fontSize: wp('3.5%'),
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginLeft: wp('1%'),
  },
  stckyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default SettingsScreen;
