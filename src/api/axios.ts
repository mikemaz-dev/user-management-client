import { API_URL } from '@/constants'
import { getAccessToken } from '@/services/auth/auth.helper'
import axios, { CreateAxiosDefaults } from 'axios'
import { getContentType } from './api.helper'

const axiosOptions: CreateAxiosDefaults = {
	baseURL: API_URL,
	headers: getContentType()
}

export const axiosClassic = axios.create(axiosOptions)

function clearCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

axiosClassic.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

axiosClassic.interceptors.response.use(
  res => {
        return res;
    },
  err => {
    if (axios.isAxiosError(err) && err.response?.status === 403) {
        clearCookies()
    }
    return Promise.reject(err)
  }
)