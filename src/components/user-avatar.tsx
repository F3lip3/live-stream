import { cva, type VariantProps } from 'class-variance-authority';

import { LiveBadge } from '@/components/live-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const avatarSizes = cva('', {
  variants: {
    size: {
      default: 'w-8 h-8',
      lg: 'w-14 h-14',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  username: string;
  imageUrl: string;
  isLive?: boolean;
  showBadge?: boolean;
}

export const UserAvatar = ({
  username,
  imageUrl,
  isLive,
  showBadge,
  size,
}: UserAvatarProps) => {
  const canShowBadge = showBadge && isLive;

  return (
    <div className='relative'>
      <Avatar
        className={cn(
          isLive && 'ring-2 ring-rose-500 border border-background',
          avatarSizes({ size })
        )}
      >
        <AvatarImage src={imageUrl} className='object-cover' />
        <AvatarFallback>
          {username[0]}
          {username[username.length - 1]}
        </AvatarFallback>
      </Avatar>
      {canShowBadge && (
        <div className='absolute -bottom-3 left-1/2 transform -translate-x-1/2'>
          <LiveBadge />
        </div>
      )}
    </div>
  );
};

type UserAvatarSkeletonProps = VariantProps<typeof avatarSizes>;

export const UserAvatarSkeleton = ({ size }: UserAvatarSkeletonProps) => {
  return <Skeleton className={cn('rounded-full', avatarSizes({ size }))} />;
};
