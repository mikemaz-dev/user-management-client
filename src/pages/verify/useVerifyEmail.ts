import { useState } from 'react'

import userService from '@/services/user.service'

export const useVerifyEmail = () => {
	const [isLoading, setLoading] = useState(false)
	const [isSuccess, setSuccess] = useState(false)
	const [isError, setError] = useState(false)

	const verify = async (token: string) => {
		try {
			setLoading(true)
			await userService.verifyEmail(token)
			setSuccess(true)
		} catch {
			setError(true)
		} finally {
			setLoading(false)
		}
	}

	return {
		verify,
		isLoading,
		isSuccess,
		isError
	}
}
