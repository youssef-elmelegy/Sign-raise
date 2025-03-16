import axios from 'axios';

export const dailyAxios = axios.create({
    baseURL: process.env.DAILY_API_URL,
    headers: {
        'Authorization': `Bearer ${process.env.DAILY_API_KEY}`
    }
});