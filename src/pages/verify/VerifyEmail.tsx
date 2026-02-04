import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useVerifyEmail } from './useVerifyEmail'

export const VerifyEmail = () => {
	const { token } = useParams<{ token: string }>()
	const navigate = useNavigate()

	const { verify, isLoading, isSuccess, isError } = useVerifyEmail()

	useEffect(() => {
		if (token) verify(token)
	}, [token])

	useEffect(() => {
		if (isSuccess) {
			setTimeout(() => navigate('/login'), 2500)
		}
	}, [isSuccess])

	if (isLoading) return <p>Подтверждаем email...</p>
	if (isError) return <p>Ссылка недействительна или устарела</p>

	if (isSuccess) {
		return <p>Email успешно подтверждён. Перенаправляем...</p>
	}

	return null
}
