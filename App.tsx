import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import SplashScreen from './screens/splashscreen';
import CheckUserLogin from './screens/CheckUserLogin';
import ProfileScreen from './screens/profileScreen';
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
import { RootStackParamList } from './screens/navigationTypes';
import CallCenterScreen from './screens/callCenter';
import MenuScreenNew from './screens/canteenAdmin/menu/MenuScreenNew';
import CashFreeSdk from './screens/cashFreeSDK/CashFreeSdk';
import PaymentStatusScreen from './screens/PaymentStatusScreen';
import PrivacyPolicy from './screens/PrivacyPolicy';
import ContactUsScreen from './screens/contactUs';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Splash'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="CheckUserLogin" component={CheckUserLogin} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SelectCanteen" component={SelectCanteenScreen} />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          initialParams={{ canteenId: undefined }}
        />
        <Stack.Screen name="CartPage" component={CartPageTwo} />
        <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
        <Stack.Screen name="ViewOrders" component={ViewOrders} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
        <Stack.Screen name="orderhistory" component={orderhistory} />
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
        <Stack.Screen name="MenuScreenNew" component={MenuScreenNew} />
        <Stack.Screen name="MenuItemDetails" component={MenuItemDetails} />
        <Stack.Screen name="CallCenter" component={CallCenterScreen} />
        <Stack.Screen
          name="MenubyMenuId"
          component={MenuItemsByMenuIdScreenNew}
          initialParams={{ menuId: undefined }}
        />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="WorkerProfile" component={WorkerProfile} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="BluetoothControl" component={BluetoothControlScreen} />
        <Stack.Screen name="VerifyToken" component={VerifyTokenScreen} />
        <Stack.Screen name="SdkHome" component={CashFreeSdk} />
        <Stack.Screen name="PaymentStatusScreen" component={PaymentStatusScreen} />
        <Stack.Screen name="privacypolicy" component={PrivacyPolicy} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;