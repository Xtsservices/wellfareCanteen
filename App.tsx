import * as React from 'react';
import {useState, useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import ProfileScreen from './screens/profileScreen';
import HomePage from './screens/homepage';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/login';
import SelectCanteenScreen from './screens/selectCanteen';
import Dashboard from './screens/dashboard';
import OrderPlacedScreen from './screens/orderPlaced';
import ViewOrders from './screens/viewOrders';
import PaymentMethod from './screens/paymentsMethod';
import SettingsScreen from './screens/SettingScreen';
import AdminDashboard from './screens/canteenAdmin/adminDashboard';
import BluetoothControlScreen from './screens/canteenAdmin/scanQr';
import WalletScreen from './screens/WalletScreen';
import orderhistory from './screens/orderhistory';
import NotificationsScreen from './screens/NotificationsScreen';
import walkin from './screens/canteenAdmin/walkin';
import Users from './screens/canteenAdmin/Users';
import AddUser from './screens/canteenAdmin/AddUser';
import WorkerProfile from './screens/canteenAdmin/WorkerProfile';
import OrderDetails from './screens/canteenAdmin/OrderDetails';
import MenuItemDetails from './screens/canteenAdmin/menu/[menuId]';
import Payment from './screens/canteenAdmin/menu/Payment';
import CartScreen from './screens/canteenAdmin/cart/index';
import VerifyTokenScreen from './screens/canteenAdmin/veifyToken';
import MenuItemsByMenuIdScreenNew from './screens/menuItemByMenuIdScreen';
import CartPageTwo from './screens/cartPageScreen';
import {RootStackParamList} from './screens/navigationTypes';
import CallCenterScreen from './screens/callCenter';
import MenuScreenNew from './screens/canteenAdmin/menu/MenuScreenNew';
import SplashScreen from './screens/splashscreen';
import PaymentServices from './screens/paymentServices';
import RNFS from 'react-native-fs';
// RNFetchBlob is imported but not directly used in the modified clearCache function.
// It's kept here as it was in the original code and might be used elsewhere.
import RNFetchBlob from 'rn-fetch-blob';
import {ErrorBoundary} from 'react-error-boundary';
import CashFreeSdk from './screens/cashFreeSDK/CashFreeSdk';
import PaymentStatusScreen from './screens/PaymentStatusScreen';
import PrivacyPolicy from './screens/PrivacyPolicy';

const Stack = createNativeStackNavigator<RootStackParamList>();




// Modified clearCache function using RNFS consistently for RNFS.CachesDirectoryPath
const clearAppFileSystemCache = async () => {
  try {
    const cacheDir = RNFS.CachesDirectoryPath;
    if (await RNFS.exists(cacheDir)) {
      await RNFS.unlink(cacheDir); // RNFS.unlink can delete directories recursively
      // Recreate the cache directory as the system or other libraries might expect it to exist
      await RNFS.mkdir(cacheDir);
      console.log(
        'App file system cache (RNFS.CachesDirectoryPath) cleared and recreated successfully.',
      );
    } else {
      console.log(
        'App file system cache directory (RNFS.CachesDirectoryPath) does not exist.',
      );
    }
  } catch (error) {
    console.error('Error clearing app file system cache:', error);
  }
};
const App = () => {



  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
  const [appKey, setAppKey] = useState(0); // Key to force re-render
  const navigationRef = React.useRef<any>(null); // Reference to navigation container
  const lastAppState = React.useRef(AppState.currentState); // Track last app state

  const checkToken = async (currentRoute?: string) => {
    try {
      // If the current route is PaymentStatusScreen, preserve it
      if (currentRoute === 'PaymentStatusScreen') {
        setInitialRoute('PaymentStatusScreen');
        return;
      }

      const token = await AsyncStorage.getItem('authorization');
      if (token) {
        setInitialRoute('Splash');
      } else {
        setInitialRoute('Home');
      }
    } catch (error) {
      console.error('Error checking token:', error);
      setInitialRoute('Home');
    }
  };

  
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        lastAppState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App is coming to the foreground
        console.log('App has come to the foreground');

        // Get the current route name
        const currentRoute =
          navigationRef.current?.getCurrentRoute()?.name;

        // Check token only if not on PaymentStatusScreen
        await checkToken(currentRoute);

        // Increment appKey to force re-render only if needed
        if (currentRoute || currentRoute !== PaymentStatusScreen) {
          setAppKey(prevKey => prevKey + 1);
        }
      } else if (nextAppState === 'inactive' || nextAppState === 'background') {
        console.log('App has gone to background or is inactive');
        await clearAppFileSystemCache(); // Clear cache
      }

      lastAppState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Initial token check on mount
    checkToken();

    return () => {
      subscription.remove();
    };
  }, []);

  if (initialRoute === null) {
    return null; // Placeholder for loading state
  }





  // const [initialRoute, setInitialRoute] = useState<
  //   keyof RootStackParamList | null
  // >(null);
  // const [appKey, setAppKey] = useState(0); // Key to force re-render

  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (nextAppState === 'active') {
  //       // Trigger any necessary updates when the app becomes active
  //       console.log('App has come to the foreground');
  //     }
  //   });

  //   return () => subscription.remove(); // Cleanup on unmount
  // }, []);
  

  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('authorization');
  //       if (token) {
  //         setInitialRoute('Splash');
  //       } else {
  //         setInitialRoute('Home');
  //       }
  //     } catch (error) {
  //       console.error('Error checking token:', error);
  //       setInitialRoute('Home');
  //     }
  //   };
  //   checkToken();
  // }, [appKey]); // Re-run when appKey changes

  // useEffect(() => {
  //   const handleAppStateChange = (nextAppState: string) => {
  //     if (nextAppState === 'active') {
  //       setAppKey(prevKey => prevKey + 1); // Increment appKey to force re-render
  //     } else if (nextAppState === 'inactive' || nextAppState === 'background') {
  //       clearAppFileSystemCache(); // Clear cache when the app goes to the background or is closed
  //     }
  //   };

  //   const subscription = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );

  //   return () => {
  //     subscription.remove(); // Clean up the event listener
  //   };
  // }, []);

  // if (initialRoute === null) {
  //   return null; // or a loading spinner
  // }

  return (
    <NavigationContainer key={appKey}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SelectCanteen" component={SelectCanteenScreen} />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          initialParams={{canteenId: undefined}}
        />
        <Stack.Screen name="CartPage" component={CartPageTwo} />
        <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
        <Stack.Screen name="ViewOrders" component={ViewOrders} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
        <Stack.Screen name="orderhistory" component={orderhistory} />
        <Stack.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
        />
        <Stack.Screen name="MenuScreenNew" component={MenuScreenNew} />
        <Stack.Screen name="MenuItemDetails" component={MenuItemDetails} />
        <Stack.Screen name="CallCenter" component={CallCenterScreen} />
        <Stack.Screen
          name="MenubyMenuId"
          component={MenuItemsByMenuIdScreenNew}
          initialParams={{menuId: undefined}} // Pass menuId as initial param
        />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="WorkerProfile" component={WorkerProfile} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen
          name="BluetoothControl"
          component={BluetoothControlScreen}
        />
        <Stack.Screen name="VerifyToken" component={VerifyTokenScreen} />
        <Stack.Screen name="SdkHome" component={CashFreeSdk} />
        <Stack.Screen name="PaymentStatusScreen" component={PaymentStatusScreen} />
        <Stack.Screen name="privacypolicy" component={PrivacyPolicy} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;