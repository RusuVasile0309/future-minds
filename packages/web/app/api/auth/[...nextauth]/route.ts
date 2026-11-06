import { handlers } from "@/auth"

export const { GET, POST } = handlers

// Next.js mapează automat HEAD → handler-ul GET, dar păstrează `method: "HEAD"`,
// iar Auth.js acceptă strict doar GET/POST și aruncă `UnknownAction`, afișat
// utilizatorului ca generic „Configuration". Scanerele de linkuri / „safe
// browsing" de pe unele routere WiFi pre-verifică URL-uri (inclusiv callback-ul
// OAuth) cu cereri HEAD/OPTIONS — de aceea pică pe WiFi și merge pe date mobile.
// Le răspundem noi, înainte să ajungă la Auth.js.
export function HEAD() {
  return new Response(null, { status: 204 })
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, HEAD, OPTIONS" },
  })
}
