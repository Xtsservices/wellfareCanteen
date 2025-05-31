import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DownNavbar from './downNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ViewShot, {captureRef} from 'react-native-view-shot';
import WebView from 'react-native-webview';

const API_URL = 'https://server.welfarecanteen.in/api/order/placeOrder';

const PaymentMethod = ({navigation}: any) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [orderResponse, setOrderResponse] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [showWebView, setShowWebView] = useState(false);
  const qrCodeRef = useRef<ViewShot>(null);

  // Place order and get payment link or order details
  const handlePayment = useCallback(async () => {
    if (!selectedMethod) {
      Alert.alert('Please select a payment method');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authorization');
      if (!token) {
        Alert.alert('Error', 'No token found');
        setLoading(false);
        return;
      }
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({paymentMethod: selectedMethod}),
      });
      const data = await response.json();
      if (response.ok && data.data) {
        setOrderResponse(data.data);
        if (
          selectedMethod === 'online' &&
          data.data.payment &&
          data.data?.paymentlink
        ) {
          setPaymentLink(data.data?.paymentlink);
          setShowWebView(true);
        } else {
          setShowOrderDetails(true);
        }
        if (selectedMethod === 'Cash') {
          Alert.alert('Order Placed Successfully');
        }
        console.log('Order Response:', data.data?.paymentlink);
        // console.log('Payment Link:', data?.paymentlink);
      } else {
        Alert.alert('Payment Failed', 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not process payment.');
    } finally {
      setLoading(false);
    }
  }, [selectedMethod]);

  // When coming back from payment, fetch order details again
  const fetchOrderDetails = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authorization');
      if (!token) {
        Alert.alert('Error', 'No token found');
        setLoading(false);
        return;
      }
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
        body: JSON.stringify({paymentMethod: 'online'}),
      });
      const data = await response.json();
      if (response.ok && data.data) {
        setOrderResponse(data.data);
        setShowOrderDetails(true);
      } else {
        Alert.alert('Failed', 'Could not fetch order details.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch order details.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle WebView navigation state change (detect payment completion)
  const handleWebViewNavigationStateChange = (navState: any) => {
    // You may need to adjust this logic based on your payment gateway's redirect URL
    if (
      navState.url &&
      (navState.url.includes('success') ||
        navState.url.includes('order-complete'))
    ) {
      setShowWebView(false);
      setPaymentLink(null);
      fetchOrderDetails();
    }
  };

  const SaveQrToGallery = async () => {
    try {
      if (Platform.OS === 'android') {
        let permission;
        if (Platform.Version >= 33) {
          permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        } else {
          permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        }
        const granted = await PermissionsAndroid.request(permission, {
          title: 'Storage Permission',
          message: 'App needs access to storage to save QR code',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission denied',
            'Cannot save QR code without permission',
          );
          return;
        }
      }
      const uri = await captureRef(qrCodeRef, {
        format: 'png',
        quality: 1,
      });
      await CameraRoll.saveAsset(uri, {type: 'photo'});
      Alert.alert('Success', 'QR code saved to gallery!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save QR code to gallery');
    }
  };

  // Reset state when payment method changes
  useEffect(() => {
    setOrderResponse(null);
    setShowOrderDetails(false);
    setPaymentLink(null);
    setShowWebView(false);
  }, [selectedMethod]);

  const handleOrderDetails = () => {
    navigation.navigate('ViewOrders' as never);
  };
  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header1}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{
              uri: 'https://welfarecanteen.in/public/Naval.jpg',
            }}
            style={[styles.logo, {marginRight: 10}]}
          />
          <Text style={[styles.headerTitle1, {fontSize: 22}]}>
            Welfare Canteen
          </Text>
        </View>
        <View style={styles.headerIcons1}>
          <TouchableOpacity style={styles.iconborder1}>
            <Image
              source={{
                uri: 'https://creazilla-store.fra1.digitaloceanspaces.com/icons/3235242/wallet-icon-sm.png',
              }}
              style={styles.icon1}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconborder1}>
            <Image
              source={{
                uri: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png',
              }}
              style={styles.icon1}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 90}}>
        <View style={[styles.header, {marginTop: 10}]}>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4d/Indian_Navy_crest.svg/1200px-Indian_Navy_crest.svg.png',
            }}
            style={[styles.logo, {width: 60, height: 60}]}
          />
          <Text style={[styles.title, {fontSize: 24, marginTop: 15}]}>
            {orderResponse ? 'Order Details' : 'Choose Payment Method'}
          </Text>
        </View>

        {/* Payment Options */}
        {!orderResponse && !showWebView && (
          <>
            <View style={[styles.paymentOptions, {marginVertical: 30}]}>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedMethod === 'online' && {
                    borderColor: '#000080',
                    borderWidth: 2,
                    backgroundColor: '#e6eaff',
                  },
                  {
                    marginBottom: 0,
                    marginHorizontal: 5,
                    width: 90,
                    height: 90,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
                onPress={() => setSelectedMethod('online')}>
                <Image
                  source={{
                    uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/PhonePe_Logo.png',
                  }}
                  style={[styles.icon, {width: 45, height: 45}]}
                />
                <Text style={[styles.optionText, {marginTop: 5, fontSize: 13}]}>
                  UPI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedMethod === 'Cash' && {
                    borderColor: '#000080',
                    borderWidth: 2,
                    backgroundColor: '#e6eaff',
                  },
                  {
                    marginBottom: 0,
                    marginHorizontal: 5,
                    width: 90,
                    height: 90,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
                onPress={() => setSelectedMethod('Cash')}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                  }}
                  style={[styles.icon, {width: 45, height: 45}]}
                />
                <Text style={[styles.optionText, {marginTop: 5, fontSize: 13}]}>
                  Cash
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.payButton,
                {
                  marginTop: 10,
                  backgroundColor: loading ? '#b3b3cc' : '#000080',
                },
              ]}
              onPress={handlePayment}
              disabled={loading || !selectedMethod}>
              <Text style={styles.payButtonText}>
                {loading ? 'Processing...' : 'PAY'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* WebView for Online Payment */}
        {showWebView && paymentLink ? (
          <View
            style={{
              height: 600,
              width: '100%',
              backgroundColor: '#fff',
              flex: 1,
            }}>
            <WebView
              source={{uri: paymentLink}}
              onNavigationStateChange={handleWebViewNavigationStateChange}
              startInLoadingState
              renderLoading={() => (
                <ActivityIndicator size="large" color="#000080" />
              )}
              onShouldStartLoadWithRequest={() => true}
              // The following prop is Android only and disables SSL checks (for dev only)
              androidHardwareAccelerationDisabled={false}
              // You can use the below prop with a custom native module to ignore SSL errors, but it's not recommended
            />
            <TouchableOpacity
              style={[
                styles.payButton,
                {marginTop: 10, backgroundColor: '#000080'},
              ]}
              onPress={handleOrderDetails}>
              <Text style={styles.payButtonText}>Back to Order Details</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Order Details */}
        {orderResponse && showOrderDetails && (
          <>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowOrderDetails(prev => !prev)}>
              <Text style={styles.toggleButtonText}>
                {showOrderDetails ? 'Hide Order Details' : 'Show Order Details'}
              </Text>
            </TouchableOpacity>
            {showOrderDetails && (
              <View style={styles.orderDetailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Order ID:</Text>
                  <Text style={styles.detailValue}>
                    {orderResponse.order.id}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Amount:</Text>
                  <Text style={styles.detailValue}>
                    ₹{orderResponse.order.totalAmount}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Method:</Text>
                  <Text style={styles.detailValue}>
                    {orderResponse.payment.paymentMethod}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Gateway Charges:</Text>
                  <Text style={styles.detailValue}>
                    ₹{orderResponse.payment.gatewayCharges}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Paid:</Text>
                  <Text style={styles.detailValue}>
                    ₹{orderResponse.payment.totalAmount}
                  </Text>
                </View>
                <ViewShot ref={qrCodeRef} style={styles.qrCodeContainer}>
                  <Text style={styles.qrCodeTitle}>Order QR Code:</Text>
                  <Image
                    source={{uri: orderResponse.order.qrCode}}
                    style={styles.qrCodeImage}
                  />
                  <TouchableOpacity
                    onPress={SaveQrToGallery}
                    style={{marginTop: 20}}>
                    <Image
                      source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/724/724933.png',
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        resizeMode: 'contain',
                        tintColor: '#000080',
                      }}
                    />
                  </TouchableOpacity>
                </ViewShot>
              </View>
            )}
          </>
        )}
      </ScrollView>
      <DownNavbar style={styles.stickyNavbar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    color: '#010080',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0014A8',
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
  },
  headerTitle1: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons1: {
    flexDirection: 'row',
  },
  icon1: {
    width: 30,
    height: 30,
  },
  iconborder1: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 7,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#000080',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    marginLeft: '10%',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 20,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  option: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    marginLeft: '10%',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  optionText: {
    color: '#000080',
    fontWeight: 'bold',
  },
  stickyNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toggleButton: {
    backgroundColor: '#000080',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: '10%',
    marginBottom: 10,
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orderDetailsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: '5%',
    marginBottom: 20,
    maxHeight: 700,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    color: '#555',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  qrCodeTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  qrCodeImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});

export default PaymentMethod;
