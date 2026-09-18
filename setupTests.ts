import { defaultConfig } from 'swr/_internal';
import '@testing-library/jest-dom';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from 'prisma/db/index';
import { server } from './mocks/server';
import 'whatwg-fetch';

// Keep request caches isolated between tests and do not schedule retries after teardown.
defaultConfig.shouldRetryOnError = false;
defaultConfig.revalidateOnFocus = false;
defaultConfig.revalidateOnReconnect = false;


// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
	server.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(() => server.close());

global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

jest.mock('next/router', () => require('next-router-mock'));

jest.mock('./prisma/db', () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
	mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
