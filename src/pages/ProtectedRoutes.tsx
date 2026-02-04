import { EnumTokens } from '@/services/auth/auth.service'
import { useCookies } from 'react-cookie'
import { Navigate, Outlet } from 'react-router-dom'
import { PUBLIC_PAGES } from 'src/config/pages/public.config'

export const ProtectedRoutes = () => {
	const [cookies] = useCookies([EnumTokens.ACCESS_TOKEN])

	if (!cookies.accessToken) {
		return (
			<Navigate
				to={PUBLIC_PAGES.LOGIN}
				replace
			/>
		)
	}

	return <Outlet />
}
