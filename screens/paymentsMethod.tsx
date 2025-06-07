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

      console.log('Full API Response:', data.data?.paymentlink);

      if (response.ok && data) {
        setOrderResponse(data);

        // Check for payment link with different possible property names
        const possiblePaymentLink =
          data.data?.paymentlink ||
          data.paymentLink ||
          data.payment_link ||
          data.link;

        console.log('Possible Payment Link:', possiblePaymentLink);

        if (selectedMethod === 'online' && possiblePaymentLink) {
          console.log('Payment Link Found:', possiblePaymentLink);
          setPaymentLink(possiblePaymentLink);

          // Reset other states before showing WebView
          setShowOrderDetails(false);

          // Add a small delay to ensure state is updated
          setTimeout(() => {
            setShowWebView(true);
          }, 100);
        } else if (selectedMethod === 'online' && !possiblePaymentLink) {
          console.log('No payment link found in response for online payment');
          Alert.alert('Error', 'Payment link not received from server');
          setShowOrderDetails(true);
        } else {
          // For cash payments or when no payment link is needed
          setShowOrderDetails(true);
          if (selectedMethod === 'Cash') {
            Alert.alert('Order Placed Successfully');
          }
        }
      } else {
        console.log('API Error Response:', data);
        Alert.alert('Payment Failed', data.message || 'Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
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
      if (response.ok && data) {
        setOrderResponse(data);
        setShowOrderDetails(true);
        setShowWebView(false);
        setPaymentLink(null);
      } else {
        Alert.alert('Failed', 'Could not fetch order details.');
      }
      console.log('Order Response after payment:', data);
    } catch (error) {
      console.error('Fetch order details error:', error);
      Alert.alert('Error', 'Could not fetch order details.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle WebView navigation state change (detect payment completion)
  const handleWebViewNavigationStateChange = (navState: any) => {
    console.log('WebView navigation state:', navState.url);
    console.log('WebView can go back:', navState.canGoBack);
    console.log('WebView loading:', navState.loading);

    // Check for success URLs (adjust these based on your payment gateway)
    if (
      navState.url &&
      (navState.url.includes('success') ||
        navState.url.includes('order-complete') ||
        navState.url.includes('payment-success') ||
        navState.url.includes('status=success') ||
        navState.url.includes('payment_status=success'))
    ) {
      console.log('Payment success detected, closing WebView');
      setShowWebView(false);
      setPaymentLink(null);
      fetchOrderDetails();
    }

    // Check for failure URLs
    if (
      navState.url &&
      (navState.url.includes('failure') ||
        navState.url.includes('cancel') ||
        navState.url.includes('error') ||
        navState.url.includes('status=failure'))
    ) {
      console.log('Payment failure/cancellation detected');
      Alert.alert('Payment Failed', 'Payment was not completed successfully.');
      setShowWebView(false);
      setPaymentLink(null);
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
      console.error('Save QR error:', error);
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

  const handleBackFromWebView = () => {
    console.log('Back button pressed in WebView');
    setShowWebView(false);
    setPaymentLink(null);
    // Show order details if we have order response
    if (orderResponse) {
      setShowOrderDetails(true);
    }
  };

  // Debug function to test WebView directly
  const testWebView = () => {
    console.log('Testing WebView with google.com');
    setPaymentLink('https://google.com');
    setShowWebView(true);
  };

  console.log('Current state:', {
    showWebView,
    paymentLink,
    showOrderDetails,
    selectedMethod,
    hasOrderResponse: !!orderResponse,
  });

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

      {/* WebView for Online Payment - Full Screen when active */}
      {showWebView && paymentLink ? (
        <View style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackFromWebView}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.webViewTitle}>Complete Payment</Text>
          </View>
          <WebView
            source={{uri: paymentLink}}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000080" />
                <Text style={styles.loadingText}>Loading payment page...</Text>
              </View>
            )}
            onShouldStartLoadWithRequest={request => {
              console.log('WebView attempting to load:', request.url);
              return true;
            }}
            onLoadStart={syntheticEvent => {
              console.log(
                'WebView load start:',
                syntheticEvent.nativeEvent.url,
              );
            }}
            onLoadEnd={syntheticEvent => {
              console.log('WebView load end:', syntheticEvent.nativeEvent.url);
            }}
            androidHardwareAccelerationDisabled={false}
            style={styles.webView}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mixedContentMode="compatibility"
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.error('WebView error: ', nativeEvent);
              Alert.alert(
                'Payment Error',
                'Failed to load payment page. Please try again.',
                [
                  {
                    text: 'Retry',
                    onPress: () => {
                      console.log('Retrying WebView load');
                      setShowWebView(false);
                      setTimeout(() => setShowWebView(true), 500);
                    },
                  },
                  {
                    text: 'Cancel',
                    onPress: handleBackFromWebView,
                    style: 'cancel',
                  },
                ],
              );
            }}
            onHttpError={syntheticEvent => {
              console.error('WebView HTTP error:', syntheticEvent.nativeEvent);
            }}
          />
        </View>
      ) : (
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

          {/* Debug Button - Remove this in production */}
          {__DEV__ && (
            <TouchableOpacity
              style={[
                styles.payButton,
                {backgroundColor: 'orange', marginBottom: 10},
              ]}
              onPress={testWebView}>
              <Text style={styles.payButtonText}>Test WebView (Debug)</Text>
            </TouchableOpacity>
          )}

          {/* Payment Options */}
          {!orderResponse && (
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
                      uri: 'https://cdn.zeebiz.com/sites/default/files/2024/01/03/274966-upigpay.jpg',
                    }}
                    style={[styles.icon, {width: 45, height: 45}]}
                  />
                  <Text
                    style={[styles.optionText, {marginTop: 5, fontSize: 13}]}>
                    UPI
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

          {/* Order Details */}
          {orderResponse && showOrderDetails && (
            <>
              <View style={styles.orderDetailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Order ID:</Text>
                  <Text style={styles.detailValue}>{orderResponse.id}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Amount:</Text>
                  <Text style={styles.detailValue}>
                    ₹{orderResponse.totalAmount}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={styles.detailValue}>{orderResponse.status}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Remaining Amount:</Text>
                  <Text style={styles.detailValue}>
                    ₹{orderResponse.payments?.remainingAmount || 0}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Wallet Payment:</Text>
                  <Text style={styles.detailValue}>
                    ₹{orderResponse.payments?.walletPaymentAmount || 0}
                  </Text>
                </View>

                {orderResponse.qrCode && (
                  <ViewShot ref={qrCodeRef} style={styles.qrCodeContainer}>
                    <Text style={styles.qrCodeTitle}>Order QR Code:</Text>
                    <Image
                      source={{uri: orderResponse.qrCode}}
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
                )}
              </View>
            </>
          )}
        </ScrollView>
      )}

      {!showWebView && <DownNavbar style={styles.stickyNavbar} />}
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
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  detailValue: {
    color: '#555',
    flex: 1,
    textAlign: 'right',
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
  webViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000080',
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    marginRight: 15,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  webViewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#000080',
    fontSize: 16,
  },
});

export default PaymentMethod;
