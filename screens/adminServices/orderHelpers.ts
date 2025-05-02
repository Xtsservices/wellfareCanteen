import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://10.0.2.2:3002/api';

const getToken = () => {
    return AsyncStorage.getItem('authorization')

}

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    config.headers.Authorization = `${getToken()}`;
    return config;
},
    (error) => {
        return Promise.reject(error);
    }
);

export const menuServices = {
    getMenusForNextTwoDays: async (canteenId: number) => {
        try {
            const response = await apiClient.get(
                `/menu/getMenusForNextTwoDaysGroupedByDateAndConfiguration?canteenId=${canteenId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching menu data:', error);
            throw error;
        }
    },
}


// Get authorization token
// export const getAuthToken = async() => {
//     try {
//         const token = await AsyncStorage.getItem('authorization');
//         if (!token) {
//             throw new Error('No authentication token found');
//         }
//         return token;
//     } catch (error) {
//         console.error('Error getting auth token:', error);
//         throw error;
//     }
// };

// // Get cart data
// export const fetchCartData = async () => {
//     try {
//         const token = await getAuthToken();

//         const response = await axios.get(`${API_BASE_URL}/cart/getCart`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 authorization: token,
//             },
//         });

//         if (response.data && response.data.data) {
//             return response.data.data;
//         } else {
//             throw new Error('No cart data found');
//         }
//     } catch (error) {
//         console.error('Error fetching cart data:', error);
//         throw error;
//     }
// };

// // Add item to cart
// export const addItemToCart = async (
//     itemId: string | number,
//     menuId: string | number,
//     menuConfigId: string | number,
//     quantity: number,
// ) => {
//     try {
//         const token = await getAuthToken();
//         const canteenId = await AsyncStorage.getItem('canteenId');
//         //   {

//         //     "itemId": 2,
//         //     "quantity": 3,
//         //     "menuId": 1,
//         //     "canteenId": 1,
//         //     "menuConfigurationId": 1
//         // }

//         const payload = {
//             itemId: Number(itemId),
//             quantity,
//             menuId: Number(menuId),
//             canteenId: Number(canteenId),
//             menuConfigurationId: Number(menuConfigId),
//         };

//         const response = await axios.post(`${API_BASE_URL}/cart/add`, payload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 authorization: token,
//             },
//         });

//         return response.data;
//     } catch (error) {
//         console.error('Error adding item to cart:', error);
//         throw error;
//     }
// };

// // Update cart item quantity
// export const updateCartItemQuantity = async (
//     cartId: number | string,
//     cartItemId: number | string | undefined,
//     quantity: number,
// ) => {
//     console.log(cartId, "cartId", cartItemId, "----cartitemid", quantity, "----quantity");


//     try {
//         const token = await getAuthToken();

//         const payload = {
//             cartId,
//             cartItemId,
//             quantity,
//         };

//         console.log('Update payload:', payload);

//         const response = await axios.post(
//             `${API_BASE_URL}/cart/updateCartItem`,
//             payload,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     authorization: token,
//                 },
//             },
//         );

//         return response.data;
//     } catch (error) {
//         console.error('Error updating cart item quantity:', error);
//         throw error;
//     }
// };

// // Remove item from cart
// export const removeCartItem = async (cartId: number, cartItemId: number) => {
//     try {
//         const token = await getAuthToken();

//         const payload = {
//             cartId,
//             cartItemId,
//         };

//         const response = await axios.post(
//             `${API_BASE_URL}/cart/removeCartItem`,
//             payload,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     authorization: token,
//                 },
//             },
//         );

//         return response.data;
//     } catch (error) {
//         console.error('Error removing cart item:', error);
//         throw error;
//     }
// };

// // Clear cart
// export const clearCart = async () => {
//     try {
//         const token = await getAuthToken();

//         const response = await axios.get(`${API_BASE_URL}/cart/clearCart`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 authorization: token,
//             },
//         });

//         return response.data;
//     } catch (error) {
//         console.error('Error clearing cart:', error);
//         throw error;
//     }
// };

// // Find cart item by item ID
// export const findCartItemByItemId = (
//     cartData: any,
//     itemId: string | number,
// ) => {
//     if (!cartData || !cartData.cartItems || !cartData.cartItems.length) {
//         return null;
//     }

//     return cartData.cartItems.find(
//         (cartItem: any) =>
//             String(cartItem.itemId) === String(itemId) ||
//             (cartItem.item && String(cartItem.item.id) === String(itemId)),
//     );
// };


// =====
// export const getMenusForNextTwoDays = async (canteenId: number) => {
//     try {
//         const token = await getAuthToken();
//         // const canteenId = await AsyncStorage.getItem('canteenId');
//         console.log("Canteen ID:", canteenId);
//         if (!token) {
//             console.error('No token found in AsyncStorage');
//             return;
//         }
//         console.log("Token:", token);
//         debugger
//         const response = axios.get(
//             `${API_BASE_URL}/menu/getMenusForNextTwoDaysGroupedByDateAndConfiguration?canteenId=${canteenId}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     Authorization: token,
//                 },
//             }
//         );

//         const json = await response.json();
//         console.log("Response JSON:", json);

//         if (json?.data) {
//             return json.data;
//         } else {
//             throw new Error('No menu data found');
//         }
//     } catch (error) {
//         console.error('Error fetching menu data:', error);
//         throw error;
//     }
// }