import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Enable API mocking before tests
beforeAll(() => server.listen());

// Reset request handlers between tests
afterEach(() => server.resetHandlers());

// Clean up after tests
afterAll(() => server.close()); 