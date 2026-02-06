import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useTransition } from 'react'
import axios from 'axios'

import authService from '@/services/auth/auth.service'
import { loginSchema, registerSchema } from '@/schemas/auth.schema'

export type TAuthForm = {
	name?: string
	email: string
	password: string
}

export function useAuthForm(isLogin?: boolean) {
	const schema = isLogin ? loginSchema : registerSchema

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<TAuthForm>({
		resolver: zodResolver(schema),
	})

	const [isPending, startTransition] = useTransition()

	const mutation = useMutation({
		mutationKey: [isLogin ? 'login' : 'register'],
		mutationFn: (data: TAuthForm) =>
			authService.main(isLogin ? 'login' : 'register', data),
		onSuccess() {
			startTransition(() => {
				reset()
				window.location.href = '/'
			})
		},
		onError(error) {
			if (axios.isAxiosError(error)) {
				alert(error.response?.data?.message ?? 'Something went wrong')
			}
		},
	})

	return {
		register,
		onSubmit: handleSubmit(data => mutation.mutate(data)),
		errors,
		isLoading: isPending || mutation.isPending || isSubmitting,
	}
}