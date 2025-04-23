// pages/api/fit/auth.ts
import { auth } from '@clerk/nextjs/server'

export const getAuthUserId = async () => {
  const { userId } = await auth()
  return userId
}
