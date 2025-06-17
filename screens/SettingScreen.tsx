import React, { useState, useCallback } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import Header from './header';
import DownNavbar from './downNavbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('authorization'),
        AsyncStorage.removeItem('phoneNumber'),
      ]);
      setIsLoggedIn(false);
      navigation.replace('Login');
    } catch (e) {
      setError('Failed to log out. Please try again.');
      console.error('Logout error:', e);
    }
  }, [navigation]);

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Header text="Settings" />
        <View style={styles.loggedOutContainer}>
          <Text style={styles.loggedOutText}>User is logged out. Please log in again.</Text>
        </View>
        <DownNavbar style={styles.stckyNavbar} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header text="Settings" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => setError('')}>
                <Text style={styles.retryButtonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <TouchableOpacity style={styles.menuItem}>
            <Image
              style={styles.profile}
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' }} 
            />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Image
              style={styles.profile}
              source={{ uri: 'https://cdn-icons-png.freepik.com/256/754/754187.png?semt=ais_hybrid' }} 
            />
            <Text style={styles.menuText}>Orders history</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Image
              style={styles.profile}
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJQDnF4cAvtdcYSFaPGY1FmFek1kOQfCJvZA&s' }}
            />
            <Text style={styles.menuText}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Image
              style={styles.profile}
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/565/565422.png' }}
            />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            {/* <Image
              style={styles.profile}
              source={require('../assets/icons/logout.png')} // Replace with local asset
            /> */}
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered By</Text>
          <Text style={styles.footerLogo}>WorldTek.in</Text>
        </View>
      </ScrollView>
      <DownNavbar style={styles.stckyNavbar} />
    </View>
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
  errorContainer: {
    backgroundColor: '#ffe6e6',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: wp('3.5%'),
    fontWeight: '500',
    marginBottom: hp('1%'),
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: wp('1.5%'),
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('4%'),
  },
  retryButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: wp('4%'),
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    borderRadius: wp('2.5%'),
    marginTop: hp('4%'),
    marginBottom: hp('3%'),
    borderColor: COLORS.ERROR,
    borderWidth: wp('0.2%'),
    backgroundColor: COLORS.LOGOUT_BG,
  },
  logoutText: {
    color: COLORS.ERROR,
    fontSize: wp('4%'),
    flex: 1,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('3%'),
    marginBottom: hp('3%'),
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