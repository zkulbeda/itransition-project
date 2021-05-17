import axios from 'axios';

console.log(process.env.NEXT_PUBLIC_API_URL);
export default axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
});
