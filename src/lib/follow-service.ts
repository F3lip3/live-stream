import { getSelf } from '@/lib/auth-service';
import { db } from '@/lib/db';

export const isFollowingUser = async (userId: string) => {
  try {
    const self = await getSelf();
    const otherUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!otherUser) throw new Error('User not found');
    if (otherUser.id === self.id) return true;

    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: self.id,
        followingId: otherUser.id,
      },
    });

    return !!existingFollow;
  } catch {
    return false;
  }
};

export const followUser = async (userId: string) => {
  const self = await getSelf();
  const otherUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!otherUser) throw new Error('User not found');
  if (otherUser.id === self.id) throw new Error('You cannot follow yourself');

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: self.id,
      followingId: otherUser.id,
    },
  });

  if (existingFollow) throw new Error('You are already following this user');

  return db.follow.create({
    data: {
      followerId: self.id,
      followingId: otherUser.id,
    },
    include: {
      follower: true,
      following: true,
    },
  });
};

export const unfollowUser = async (userId: string) => {
  const self = await getSelf();
  const otherUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!otherUser) throw new Error('User not found');
  if (otherUser.id === self.id) throw new Error('You cannot unfollow yourself');

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: self.id,
      followingId: otherUser.id,
    },
  });

  if (!existingFollow) throw new Error('You are not following this user');

  return db.follow.delete({
    where: {
      id: existingFollow.id,
    },
    include: {
      following: true,
    },
  });
};
