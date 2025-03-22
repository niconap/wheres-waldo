const { mockDeep, mockReset } = require('jest-mock-extended');

jest.mock('../src/db/client', () => ({
  __esModule: true,
  prisma: mockDeep(),
}));

const prisma = require('../src/db/client').prisma;
const prismaMock = prisma;

beforeEach(() => {
  mockReset(prismaMock);
});

module.exports = { prismaMock };
