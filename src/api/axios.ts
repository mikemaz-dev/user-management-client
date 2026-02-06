import { API_URL } from '@/constants'
import { getAccessToken } from '@/services/auth/auth.helper'
import axios, { CreateAxiosDefaults } from 'axios'
import { getContentType } from './api.helper'
import { doLogout } from '@/utils/doLogout'

const axiosOptions: CreateAxiosDefaults = {
	baseURL: API_URL,
	headers: getContentType()
}

export const axiosClassic = axios.create(axiosOptions)

axiosClassic.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

axiosClassic.interceptors.response.use(
  res => res,
  err => {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 403) {
        doLogout()
      }
    }
    return Promise.reject(err)
  }
)