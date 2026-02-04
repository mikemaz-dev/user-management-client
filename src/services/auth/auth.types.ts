export enum UserStatuses {
	PENDING = 'PENDING',
	ACTIVE = 'ACTIVE',
	BLOCKED = 'BLOCKED',
	ADMIN = 'ADMIN'
}

export interface ITokenInside {
	id: number
	statuses: UserStatuses[]
	iat: number
	exp: number
}

export type TProtectUserData = Omit<ITokenInside, 'iat' | 'exp'>
