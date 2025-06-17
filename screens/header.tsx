import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes'; // Adjust the import path as necessary
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IoIcon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardProps {
  text: string;
}

const Header: React.FC<DashboardProps> = ({ text }) => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{text}</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconborder}>
          <FontAwesome name="person" size={30} color="#007AFF"  />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconborder}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
           <IoIcon name="home" size={10} color="#007AFF"  />
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
});

export default Header;