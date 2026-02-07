import { COOKIE_OPTIONS } from '@/constants'
import { EnumTokens } from '@/services/auth/auth.service'

export const doLogout = () => {
  const cookieName = EnumTokens.ACCESS_TOKEN
  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT'
  
  document.cookie = `${cookieName}=; expires=${expires}; path=/;`

  let extra = ''
  
  if ('domain' in COOKIE_OPTIONS && typeof COOKIE_OPTIONS.domain === 'string') {
    extra += ` domain=${COOKIE_OPTIONS.domain};`
  }
  
  if ('secure' in COOKIE_OPTIONS && COOKIE_OPTIONS.secure) {
    extra += ' secure;'
  }

  if (extra) {
    document.cookie = `${cookieName}=; expires=${expires}; path=/;${extra}`
  }

  window.location.href = '/login'
}