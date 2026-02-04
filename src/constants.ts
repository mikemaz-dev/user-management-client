export const API_URL = '`https://user-management-server-dljo.onrender.com/api`'
export const IS_CLIENT = typeof window !== 'undefined'

export const COOKIE_OPTIONS = {
	path: '/',
	sameSite: 'lax' as const
}
