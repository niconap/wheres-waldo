const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const photo = await prisma.photo.create({
    data: {
      path: '/beach.jpg',
      title: 'At the beach',
      Leaderboard: {
        create: {
          Entry: {
            create: {
              name: 'John Doe',
              score: 100,
            },
          },
        },
      },
      Character: {
        createMany: {
          data: [
            {
              name: 'Waldo',
              x1: 60,
              y1: 36,
              x2: 62,
              y2: 42,
            },
            {
              name: 'Odlaw',
              x1: 8,
              y1: 34,
              x2: 10,
              y2: 41,
            },
            {
              name: 'Wizard',
              x1: 25,
              y1: 34,
              x2: 27,
              y2: 39,
            },
            {
              name: 'Wenda',
              x1: 75,
              y1: 40,
              x2: 78,
              y2: 44,
            },
          ],
        },
      },
    },
  });

  console.log('Photo created:', photo);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
