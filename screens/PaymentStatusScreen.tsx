import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from './header';
import DownNavbar from './downNavbar';

// Constants
const COLORS = {
  PRIMARY: '#0014A8',
  ERROR: '#ff4d4d',
  TEXT_SECONDARY: '#666',
  TEXT_DARK: '#222',
  BACKGROUND: '#F4F6FB',
  CARD: '#fff',
  BORDER: '#e6eaf2',
};

// Type Definitions
type RootStackParamList = {
  CartPage: undefined;
  PaymentMethod: undefined;
  ViewOrders: undefined;
  Splash: undefined;
  PaymentStatusScreen: { status: 'success' | 'failure'; orderData?: any; error?: any };
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
  replace: (screen: keyof RootStackParamList) => void;
  canGoBack: () => boolean;
  addListener: (event: string, callback: (e: any) => void) => () => void;
};

// Remove this custom RouteProp type, we'll use the one from @react-navigation/native

const PaymentStatusScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'PaymentStatusScreen'>>();
  const { status, orderData, error } = route.params;

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      // Optionally, you can add custom logic here if needed
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
      backAction();
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation]);

  const handleContinue = () => {
    navigation.replace('ViewOrders');
  };

  const handleRetry = () => {
    navigation.replace('PaymentMethod');
  };

  return (
    <View style={styles.container}>
      <Header text={status === 'success' ? 'Payment Successful' : 'Payment Failed'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusContainer}>
          <Image
            source={{
              uri:
                status === 'success'
                  ? 'https://cdn-icons-png.flaticon.com/512/5709/5709755.png'
                  : 'https://cdn-icons-png.flaticon.com/512/1828/1828666.png',
            }}
            style={styles.statusIcon}
          />
          <Text style={styles.statusTitle}>
            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </Text>
          <Text style={styles.statusMessage}>
            {status === 'success'
              ? 'Your payment has been processed successfully.'
              : error?.message || 'Something went wrong. Please try again.'}
          </Text>
          {orderData && (
            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order ID:</Text>
                <Text style={styles.detailValue}>{orderData.id}</Text>
              </View>
              {orderData.totalAmount && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Amount:</Text>
                  <Text style={styles.detailValue}>₹{orderData.totalAmount}</Text>
                </View>
              )}
              {orderData.status && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={styles.detailValue}>{orderData.status}</Text>
                </View>
              )}
              {orderData.payments?.remainingAmount !== undefined && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Remaining Amount:</Text>
                  <Text style={styles.detailValue}>
                    ₹{orderData.payments.remainingAmount}
                  </Text>
                </View>
              )}
              {orderData.payments?.walletPaymentAmount !== undefined && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Wallet Payment:</Text>
                  <Text style={styles.detailValue}>
                    ₹{orderData.payments.walletPaymentAmount}
                  </Text>
                </View>
              )}
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: status === 'success' ? COLORS.PRIMARY : COLORS.ERROR },
            ]}
            onPress={status === 'success' ? handleContinue : handleRetry}
          >
            <Text style={styles.actionButtonText}>
              {status === 'success' ? 'View Orders' : 'Retry Payment'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <DownNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    paddingBottom: hp('10%'),
  },
  statusContainer: {
    backgroundColor: COLORS.CARD,
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginVertical: hp('2%'),
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.08,
    shadowRadius: wp('1.5%'),
  },
  statusIcon: {
    width: wp('20%'),
    height: wp('20%'),
    resizeMode: 'contain',
    marginBottom: hp('2%'),
  },
  statusTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    marginBottom: hp('1%'),
  },
  statusMessage: {
    fontSize: wp('4%'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  orderDetails: {
    width: '100%',
    marginBottom: hp('3%'),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  detailLabel: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
    flex: 1,
  },
  detailValue: {
    fontSize: wp('3.8%'),
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
    textAlign: 'right',
  },
  actionButton: {
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    width: '100%',
    elevation: 2,
  },
  actionButtonText: {
    color: COLORS.CARD,
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});

export default PaymentStatusScreen;