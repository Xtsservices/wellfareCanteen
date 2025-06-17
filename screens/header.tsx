import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './navigationTypes'; // Adjust the import path as necessary
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

interface DashboardProps {
  text: string;
}

const Header: React.FC<DashboardProps> = ({text}) => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  return (
    <View style={styles.header}>
      <Image
        source={{uri: 'https://welfarecanteen.in/public/Naval.jpg'}}
        style={styles.logo}
      />
      <Text style={styles.headerTitle}>{text}</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity
          style={styles.iconborder}
          onPress={() => navigation.navigate('WalletScreen')}
        >
          <Image
            source={require('../screens/imgs/wallet_png.png')} // Adjust path to your wallet PNG
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconborder}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
          <Image
            source={require('../screens/imgs/1077114.png')} // Adjust path to your profile PNG
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0014A8',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('7%'),
    borderBottomLeftRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
  },
  logo: {
    width: 38,
    height: 38,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  headerTitle: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconborder: {
    backgroundColor: '#fff',
    borderRadius: wp('50%'),
    padding: wp('2%'),
    marginLeft: wp('2.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: wp('7%'),
    height: wp('7%'),
  },
});

export default Header;
