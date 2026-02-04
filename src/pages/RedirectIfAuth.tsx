import { useCookies } from 'react-cookie'
import { Navigate, Outlet } from 'react-router-dom'

import { EnumTokens } from '@/services/auth/auth.service'

export const RedirectIfAuth = () => {
	const [cookies] = useCookies([EnumTokens.ACCESS_TOKEN])

	if (cookies.accessToken) {
		return (
			<Navigate
				to='/'
				replace
			/>
		)
	}

	return <Outlet />
}
