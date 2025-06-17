import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AllCanteens} from './services/restApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from './navigationTypes';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
// import LinearGradient from 'react-native-linear-gradient'; // Uncomment if using gradient

type NavigationProp = StackNavigationProp<RootStackParamList, 'SelectCanteen'>;

type Canteen = {
  id: string;
  canteenName: string;
  canteenImage: string;
};

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

const SelectCanteenScreen = () => {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const fetchCanteens = async () => {
    console.log('Fetching canteens...');
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authorization');
      if (!token) return;
      const state = await NetInfo.fetch();
      const response = await axios.get(AllCanteens(), {
        headers: {Authorization: token},
      });
      if (response.data && response.data.data) {
        setCanteens(
          response.data.data.map((item: any) => ({
            id: item.id.toString(),
            canteenName: item.canteenName,
            canteenImage: item.canteenImage,
          })),
        );
      }
    } catch (error) {
      // fallback or error handling
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCanteens();
    }, []),
  );

  const handleCanteenSelect = (canteenName: string) => {
    setSelectedCanteen(canteenName);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Exit app when back is pressed on Dashboard
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Exit', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      ); 

      return () => {
        backHandler.remove();
      };
    }, []),
  );

  const handleConfirm = () => {
    if (selectedCanteen) {
      const selectedCanteenId = canteens.find(
        canteen => canteen.canteenName === selectedCanteen,
      )?.id;
      if (selectedCanteenId) {
        navigation.navigate('Dashboard', {canteenId: selectedCanteenId});
      }
    }
  };

  const renderCanteenItem = ({item}: {item: Canteen}) => (
    <TouchableOpacity
      style={[
        styles.canteenCard,
        selectedCanteen === item.canteenName && styles.selectedCard,
      ]}
      onPress={() => handleCanteenSelect(item.canteenName)}
      activeOpacity={0.85}>
      <Image
        source={{uri: item.canteenImage}}
        style={styles.canteenImage}
        resizeMode="cover"
      />
      <Text style={styles.canteenName} numberOfLines={2}>
        {item.canteenName}
      </Text>
      {selectedCanteen === item.canteenName && (
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    // <LinearGradient colors={['#f5f7fa', '#e3e6f3']} style={styles.gradient}> {/* Uncomment for gradient */}
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}> Select Your Canteen</Text>
        <Text style={styles.headerSubtitle}>Click To Use</Text>
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate('SdkHome')}>
        <Text style={styles.confirmButtonText}>Go to SdkHome</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#010080" />
        </View>
      ) : (
        <FlatList
          data={canteens}
          keyExtractor={item => item.id}
          renderItem={renderCanteenItem}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No canteens available.</Text>
          }
        />
      )}

      {selectedCanteen && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Selection</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
    // </LinearGradient> {/* Uncomment for gradient */}
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  // gradient: { flex: 1 },
  header: {
    paddingTop: 36,
    paddingBottom: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
    elevation: 2,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#010080',
    fontFamily: 'Poppins',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#555',
    fontFamily: 'Poppins',
    marginBottom: 2,
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  canteenCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: 10,
    width: CARD_WIDTH,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#010080',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    paddingVertical: 18,
    paddingHorizontal: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e3e6f3',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#010080',
    shadowOpacity: 0.18,
    shadowColor: '#010080',
    backgroundColor: '#f0f4ff',
  },
  canteenImage: {
    width: CARD_WIDTH - 28,
    height: CARD_WIDTH - 28,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
  canteenName: {
    color: '#010080',
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Poppins',
    marginBottom: 2,
    minHeight: 40,
    letterSpacing: 0.2,
  },
  checkCircle: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#010080',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  checkMark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  confirmButton: {
    backgroundColor: '#010080',
    paddingVertical: 16,
    borderRadius: 16,
    alignSelf: 'center',
    width: '90%',
    marginBottom: 30,
    marginTop: 10,
    elevation: 4,
    shadowColor: '#010080',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'Poppins',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 60,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectCanteenScreen;
