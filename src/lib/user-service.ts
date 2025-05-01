import { db } from '@/lib/db';

export const getUserByUsername = async (username: string) => {
  return db.user.findUnique({
    where: { username },
  });
};
