import { COOKIE_OPTIONS } from '@/constants'
import { EnumTokens } from '@/services/auth/auth.service'
import { useQueryClient } from '@tanstack/react-query'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

export const doLogout = () => {
	const queryClient = useQueryClient()
	const [_, removeCookie] = useCookies([EnumTokens.ACCESS_TOKEN])
	const navigate = useNavigate()

		removeCookie(EnumTokens.ACCESS_TOKEN, COOKIE_OPTIONS)
		const cookieName = EnumTokens.ACCESS_TOKEN
		document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
		if (COOKIE_OPTIONS?.path) {
			document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${COOKIE_OPTIONS.path};`
		}
		queryClient.clear()
		navigate('/login', { replace: true })
	}