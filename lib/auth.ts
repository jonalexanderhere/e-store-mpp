// Simple session management (you might want to use JWT or sessions in production)
let currentUser: any = null

export async function signUp(email: string, password: string) {
  // TODO: Implement MongoDB signup via API
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  
  return data
}

export async function signIn(email: string, password: string) {
  // TODO: Implement MongoDB signin via API
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  const data = await response.json()
  if (!data.success) throw new Error(data.error)
  
  // Set current user
  currentUser = data.user
  
  return data
}

export async function signOut() {
  currentUser = null
}

export async function getCurrentUser(): Promise<any | null> {
  return currentUser
}

export async function getUserRole(): Promise<'admin' | 'customer' | null> {
  const user = await getCurrentUser()
  return user?.role || null
}


