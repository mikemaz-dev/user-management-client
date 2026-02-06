import { useAuthForm } from './useAuthForm'

export function AuthForm({ isLogin }: { isLogin?: boolean }) {
	const {isLoading, onSubmit, register, errors } = useAuthForm(isLogin)

	return (
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
							{!isLogin && errors.name && (
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
	)
}
