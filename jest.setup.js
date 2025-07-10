import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'

// Configure Testing Library
configure({
  asyncUtilTimeout: 5000,
  testIdAttribute: 'data-testid',
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  redirect: jest.fn(),
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Configure React's act environment
global.IS_REACT_ACT_ENVIRONMENT = true 