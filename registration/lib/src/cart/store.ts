const COOKIE_PREFIX = "oes-current-cart-"

export class CookieCurrentCartStore {
  get(eventId: string): string | null {
    const cookieName = `${COOKIE_PREFIX}${eventId}`
    const items = document.cookie.split("; ")
    const entry = items.find((it) => it.startsWith(`${cookieName}=`))
    if (!entry) {
      return null
    }
    return entry.substring(cookieName.length + 1)
  }

  set(eventId: string, cartId: string | null) {
    const cookieName = `${COOKIE_PREFIX}${eventId}`
    if (cartId) {
      document.cookie = `${cookieName}=${cartId}; path=/; SameSite=strict; max-age=86400`
    } else {
      document.cookie = `${cookieName}=; path=/; SameSite=strict; max-age=0`
    }
  }
}
