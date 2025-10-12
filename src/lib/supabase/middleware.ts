import { createServerClient, CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// 1) Normaliza el dominio para que SIEMPRE tenga punto inicial (.lvh.me)
const RAW_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN // en tu .env: lvh.me
const COOKIE_DOMAIN = RAW_DOMAIN
  ? `.${RAW_DOMAIN.replace(/^\./, '')}`
  : undefined
// Resultado: '.lvh.me'

export async function updateSession(request: NextRequest, headers?: Headers) {
  let supabaseResponse = NextResponse.next({ request, headers })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // 2) También pásalo a Supabase para que sus writes usen el mismo dominio
      cookieOptions: {
        domain: COOKIE_DOMAIN, // '.lvh.me'
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Mantén el request cookie jar sincronizado (no define dominio aquí)
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          // Crea una nueva respuesta para poder escribir Set-Cookie
          supabaseResponse = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) => {
            // 3) Construye opciones desde cero y **NUNCA** uses options.domain
            const safeOpts: CookieOptions = {
              domain: COOKIE_DOMAIN, // <- fuerza '.lvh.me'
              path: options?.path ?? '/', // evita path raros
              httpOnly: options?.httpOnly ?? true,
              sameSite:
                (options?.sameSite as CookieOptions['sameSite']) ?? 'lax',
              secure: options?.secure ?? process.env.NODE_ENV === 'production',
              // preserva solo expiración/maxAge si venían
              ...(options?.maxAge ? { maxAge: options.maxAge } : {}),
              ...(options?.expires ? { expires: options.expires } : {}),
            }

            supabaseResponse.cookies.set(name, value, safeOpts)
          })
        },
      },
    }
  )

  // ¡No metas lógica aquí entre createServerClient y getUser!
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}
