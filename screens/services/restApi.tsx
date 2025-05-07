// const URL = "http://localhost:3002/api"

const URL = 'http://10.0.2.2:3002/api';
const url1 = "http://TB351FU_RF01_250321:3002/api"

export const Login = () => `${URL}/login`;
export const VerifyOtp = () => `${URL}/verifyOtp`;
export const ResendOtp = () => `${URL}/resendOtp`;
export const AllCanteens = () => `${URL}/user/getAllCanteens`;
// export const MenuItems = (canteenId: string) =>
//   `${URL}/user/getMenuItems?canteenId=${canteenId}`;
export const GetMenuItemsbyCanteenId = (canteenId: string) =>
  `${URL}/menu/getMenusForNextTwoDaysGroupedByDateAndConfiguration?canteenId=${canteenId}`;


