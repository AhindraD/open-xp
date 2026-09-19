'use client'

import { type ReactNode } from 'react'

/**
 * Auth Provider — Cognito via AWS Amplify
 *
 * V1 Stub: Will be configured with actual Cognito User Pool
 * after AWS deployment. For now, wraps children with a context
 * placeholder.
 *
 * TODO: Configure Amplify with:
 *   Amplify.configure({
 *     Auth: {
 *       Cognito: {
 *         userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
 *         userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
 *       }
 *     }
 *   })
 */

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Amplify auth will be configured here after AWS deployment
  return <>{children}</>
}
