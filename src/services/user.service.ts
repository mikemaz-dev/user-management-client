import { axiosClassic } from '@/api/axios';
import { IUser } from '@/types/user.types';

class UserService {
	private _BASE_URL = '/users'

	async fetchProfile() {
		return axiosClassic.get<IUser>(`${this._BASE_URL}/profile`)
	}

	async fetchList(params?: { status?: string; role?: string }) {
		return axiosClassic.get<IUser[]>(`${this._BASE_URL}`, {
			params
		})
	}

	async verifyEmail(token: string) {
		return axiosClassic.get(`${this._BASE_URL}/verify/${token}`)
	}
}

export default new UserService()
