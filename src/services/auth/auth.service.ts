import { axiosClassic } from '@/api/axios'

import { saveTokenStorage } from './auth.helper'
import { IFormData, IUser } from '@/types/user.types'

interface IAuthResponse {
	accessToken: string
	user: IUser
}

export enum EnumTokens {
	'ACCESS_TOKEN' = 'accessToken',
	'REFRESH_TOKEN' = 'refreshToken'
}

class AuthService {
	async main(type: 'login' | 'register', data: IFormData) {
		const response = await axiosClassic.post<IAuthResponse>(`/auth/${type}`, data)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	}

	async logout() {
		return axiosClassic.post('/auth/logout')
	}
}

export default new AuthService()
