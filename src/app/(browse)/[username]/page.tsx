import { Actions } from '@/app/(browse)/[username]/_components/actions';
import { isFollowingUser } from '@/lib/follow-service';
import { getUserByUsername } from '@/lib/user-service';
import { notFound } from 'next/navigation';

interface UserPageProps {
  params: {
    username: string;
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  const user = await getUserByUsername(username);
  if (!user) notFound();

  const isFollowing = await isFollowingUser(user.id);

  return (
    <div className='flex flex-col gap-y-0.5'>
      <p>User: {user.username}</p>
      <p>User id: {user.id}</p>
      <p>Is following: {isFollowing ? 'yes' : 'no'}</p>
      <Actions userId={user.id} isFollowing={isFollowing} />
    </div>
  );
}
