import { getSelf } from '@/lib/auth-service';
import { db } from '@/lib/db';

export const getRecommended = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let userId: string | null;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  if (userId) {
    return db.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  return db.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};
