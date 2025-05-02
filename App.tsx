import * as React from 'react';
import ProfileScreen from './screens/profileScreen';
import HomePage from './screens/homepage';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login';
import SelectCanteenScreen from './screens/selectCanteen';
import Dashboard from './screens/dashboard';
import OrderPlacedScreen from './screens/orderPlaced';
import ViewOrders from './screens/viewOrders';
import PaymentMethod from './screens/paymentsMethod';
import SettingsScreen from './screens/SettingScreen';
import AdminDashboard from './screens/canteenAdmin/AdminDashboard';
import BluetoothControlScreen from './screens/canteenAdmin/scanQr';
import WalletScreen from './screens/WalletScreen';
import orderhistory from './screens/orderhistory'
import NotificationsScreen from './screens/NotificationsScreen';
import breakfast from './screens/canteenAdmin/walkin';
import Users from './screens/canteenAdmin/Users';
import AddUser from './screens/canteenAdmin/AddUser';
import WorkerProfile from './screens/canteenAdmin/WorkerProfile'
import Menu from './screens/canteenAdmin/Menu';
import Checkout from './screens/canteenAdmin/Checkout'
import Orders from './screens/canteenAdmin/Orders';



import VerifyTokenScreen from './screens/canteenAdmin/veifyToken';
// import MenuItemsByMenuIdScreen2 from './screens/menuItemByMenuIdScreen';
// import MenuItemsByMenuIdScreen2 from './screens/menuItemsByMenuId';
import MenuItemsByMenuIdScreenNew from './screens/menuItemByMenuIdScreen';
import CartPageTwo from './screens/cartPageScreen';
import {RootStackParamList} from './screens/navigationTypes'; // Adjust the
import CallCenterScreen from './screens/callCenter';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SelectCanteen" component={SelectCanteenScreen} />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          initialParams={{canteenId: undefined}} // Pass canteenId as initial param
        />
        <Stack.Screen
          name="MenubyMenuId"
          // component={MenuItemsByMenuIdScreen}
          component={MenuItemsByMenuIdScreenNew}
          initialParams={{menuId: undefined}} // Pass menuId as initial param
        />
        <Stack.Screen name="CartPage" component={CartPageTwo} />
        <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
        <Stack.Screen name="ViewOrders" component={ViewOrders} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
        <Stack.Screen name="orderhistory" component={orderhistory} />
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen}/>
        <Stack.Screen name="breakfast" component={breakfast}/>
        <Stack.Screen name="CallCenter" component={CallCenterScreen} />

        {/* Canteen Admin */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="WorkerProfile" component={WorkerProfile}/>
        <Stack.Screen name="Checkout" component={Checkout}/>
        <Stack.Screen name="Orders" component={Orders}/>
        <Stack.Screen
          name="BluetoothControl"
          component={BluetoothControlScreen}
        />
        <Stack.Screen name="VerifyToken" component={VerifyTokenScreen} />

        {/* Add other screens here */}
      </Stack.Navigator>
      <Toast /> 
    </NavigationContainer>
  );
};

export default App;
