export type TUserStatus = 'ACTIVE' | 'BLOCKED' | 'UN_VERIFIED'

export type IUser = {
	id: string
	name: string | null
	email: string
	status: TUserStatus
	lastSeen: string | null
}

export interface IFormData extends Pick<IUser, 'email'> {
	name?: string
	password: string
}
