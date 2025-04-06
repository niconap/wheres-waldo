const { mockDeep, mockReset } = require('jest-mock-extended');

jest.mock('../src/db/client', () => ({
  __esModule: true,
  prisma: mockDeep(),
}));

// The session store needs to be mocked to prevent connection errors, no test
// actually uses this mock.
jest.mock('@quixo3/prisma-session-store', () => {
  return {
    PrismaSessionStore: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn(),
        set: jest.fn(),
        destroy: jest.fn(),
        on: jest.fn(),
      };
    }),
  };
});

jest.mock('express-session', () => {
  return jest.fn(() => (req, _, next) => {
    req.session = {
      start: 1000,
      leaderboardId: 1,
      score: 1000,
      status: { found: [], notFound: [1, 2] },
    };
    next();
  });
});

jest.spyOn(Date, 'now').mockImplementation(() => 2000);

const prisma = require('../src/db/client').prisma;
const prismaMock = prisma;

beforeEach(() => {
  mockReset(prismaMock);
});

module.exports = { prismaMock };
