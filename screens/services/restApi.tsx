// const URL = "http://localhost:3002/api"
const URL = "http://10.0.2.2:3002/api"

export const Login = () => `${URL}/login`
export const verifyOtp = () => `${URL}/verifyOtp`
export const resendOtp = () => `${URL}/resendOtp`