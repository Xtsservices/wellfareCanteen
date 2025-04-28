
export interface WorkerUser {
  dob: number;
  aadhar: number;
  name: string;
  mobile: string;
  gender: string;
  email: string;
  address: string;
  adminName: string;
  adminId: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutCartItem {
  code: string;
  item: string;
  qty: number;
  total: number;
}

export type RootStackParamList = {
  SettingsScreen: undefined;
  LoginScreen: undefined;
  ProfileScreen: undefined;
  SelectCanteen: undefined;
  NotificationsScreen: undefined;
  WalletScreen: undefined;
  OrderHistory: undefined;
  BluetoothControl: undefined;
  AdminDashboard: undefined;
  Breakfast: undefined;
  Users: undefined;
  WorkerProfile: { 
    user: {

      id: number;
      name: string;
      mobile: string;
      position: string;
      email: string;
      address: string;
      dob: string;
      gender: string;
      aadhar: string;
      adminName: string;
      adminId: string;
    }
  };
  AddUser: undefined;
  Menu: undefined;
  Checkout: {
    cart: CheckoutCartItem[];   
    total: number;
  };
  
  Home: undefined;
  Login: undefined;
  Dashboard: { canteenId: string };
  CartPage: undefined;
  OrderPlaced: undefined;
  ViewOrders: undefined;
  PaymentMethod: undefined;
  VerifyToken: undefined;
  MenubyMenuId: {menuId: string};
  orderhistory: undefined;
  MenuItemsByMenuId: { menuId: string };
  breakfast: undefined;
};
