import axios from 'axios'

import { zEnv } from '../shared/constants/environment'
import { LOCAL_STORAGE_KEYS } from '../shared/constants/storageKeys'

export const $api = axios.create({
  baseURL: zEnv.VITE_ORIGIN_API_URL,
  timeout: 20000,
  withCredentials: true,
})

export const $imby = axios.create({
  baseURL: zEnv.VITE_IMBY_API_URL,
  timeout: 20000,
  headers: {
    Authorization: `Bearer ${zEnv.VITE_IMBY_API_ACCESS_TOKEN}`,
  },
})

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)}`
  return config
})
