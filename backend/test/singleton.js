const { mockDeep, mockReset } = require('jest-mock-extended');

jest.mock('../src/db/client', () => ({
  __esModule: true,
  prisma: mockDeep(),
}));

jest.spyOn(Date, 'now').mockImplementation(() => 2000);

const prisma = require('../src/db/client').prisma;
const prismaMock = prisma;

beforeEach(() => {
  mockReset(prismaMock);
});

module.exports = { prismaMock };
