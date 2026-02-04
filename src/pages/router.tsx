import { createBrowserRouter } from 'react-router-dom'

import { PUBLIC_PAGES } from '@/config/pages/public.config'

import { ProtectedRoutes } from './ProtectedRoutes'
import { RedirectIfAuth } from './RedirectIfAuth'
import { Login } from './auth/login/Login'
import { Register } from './auth/register/Register'
import { HomePage } from './home/HomePage'
import { VerifyEmail } from './verify/VerifyEmail'

export const router = createBrowserRouter([
	{
		element: <RedirectIfAuth />,
		children: [
			{
				path: PUBLIC_PAGES.LOGIN,
				element: <Login />
			},
			{
				path: PUBLIC_PAGES.REGISTER,
				element: <Register />
			}
		]
	},
	{
		element: <ProtectedRoutes />,
		children: [
			{
				path: PUBLIC_PAGES.HOME,
				element: <HomePage />
			},
			{
				path: '/verify/:token',
				element: <VerifyEmail />
			}
		]
	},
	{
		path: '*',
		element: <div>404 not found!</div>
	}
])
