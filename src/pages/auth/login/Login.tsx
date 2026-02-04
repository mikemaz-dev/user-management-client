import { AuthForm } from '../AuthForm'

export function Login() {
	return (
		<div className='container-fluid vh-100 w-screen h-screen'>
			<div className='row h-100'>
				<div className='col-lg-6 d-flex flex-column justify-content-center align-bottom min-vh-100'>
					<header className='pt-5 ps-5 mb-auto'>
						<h1 className='fw-bold text-primary'>THE APP</h1>
					</header>
					<AuthForm isLogin />
				</div>

				<div className='col-lg-6 d-none d-lg-block p-0'>
					<div
						className='h-100 w-100'
						style={{
							backgroundImage: 'url(./images/abstract-bg.jpg)',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					/>
				</div>
			</div>
		</div>
	)
}
