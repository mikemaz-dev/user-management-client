import { PUBLIC_PAGES } from '@/config/pages/public.config'

import { useAuthForm } from './useAuthForm'

export function AuthForm({ isLogin }: { isLogin?: boolean }) {
	const { errors, isLoading, onSubmit, register } = useAuthForm(isLogin)

	return (
		<>
			<main className='grow d-flex align-items-center justify-content-center'>
			<div className='w-100' style={{ maxWidth: 420 }}>
				<p className='text-muted mb-1'>Start your journey</p>
				<h4 className='mb-4'>Sign {isLogin ? 'In' : 'Up'} to The App</h4>

				<form onSubmit={onSubmit}>
					{!isLogin && (
						<div className='mb-3'>
							<label className='form-label'>Name</label>
							<input
								className='form-control'
								{...register('name')}
							/>
							{errors.name && (
								<p className='text-danger'>{errors.name.message}</p>
							)}
						</div>
					)}

					<div className='mb-3'>
						<label className='form-label'>E-mail</label>
						<input
							className='form-control'
							{...register('email')}
						/>
						{errors.email && (
							<p className='text-danger'>{errors.email.message}</p>
						)}
					</div>

					<div className='mb-3'>
						<label className='form-label'>Password</label>
						<input
							type='password'
							className='form-control'
							{...register('password')}
						/>
						{errors.password && (
							<p className='text-danger'>
								{errors.password.message}
							</p>
						)}
					</div>

					<button
						type='submit'
						className='btn btn-primary w-100'
						disabled={isLoading}
					>
						{isLogin ? 'Sign In' : 'Sign Up'}
					</button>
				</form>
			</div>
		</main>

			<footer className='d-flex justify-content-between px-5 pb-5 mt-auto'>
				<span className='text-muted'>
					Don&apos;t have an account?{' '}
					<a
						href={isLogin ? PUBLIC_PAGES.REGISTER : PUBLIC_PAGES.LOGIN}
						className='text-decoration-none'
					>
						{isLogin ? 'Sign Up' : 'Sign In'}
					</a>
				</span>
			</footer>
		</>
	)
}
