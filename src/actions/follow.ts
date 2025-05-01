'use server';

import { followUser, unfollowUser } from '@/lib/follow-service';
import { revalidatePath } from 'next/cache';

export const onFollow = async (userId: string) => {
  try {
    const followedUser = await followUser(userId);

    revalidatePath('/');

    if (followedUser) {
      revalidatePath(`/${followedUser.following.username}`);
    }

    return followedUser;
  } catch {
    throw new Error('Internal Server Error');
  }
};

export const onUnfollow = async (userId: string) => {
  try {
    const unfollowedUser = await unfollowUser(userId);

    revalidatePath('/');

    if (unfollowedUser) {
      revalidatePath(`/${unfollowedUser.following.username}`);
    }

    return unfollowedUser;
  } catch {
    throw new Error('Internal Server Error');
  }
};
