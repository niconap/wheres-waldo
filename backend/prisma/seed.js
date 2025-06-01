const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const photo1 = await prisma.photo.create({
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

  const photo2 = await prisma.photo.create({
    data: {
      path: '/castle.jpg',
      title: 'At the castle',
      Leaderboard: {
        create: {
          Entry: {
            create: {
              name: 'Jane Smith',
              score: 200,
            },
          },
        },
      },
      Character: {
        createMany: {
          data: [
            {
              name: 'Waldo',
              x1: 0,
              y1: 0,
              x2: 100,
              y2: 100,
            },
          ],
        },
      },
    },
  });

  console.log('Photos created:', photo1, photo2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
