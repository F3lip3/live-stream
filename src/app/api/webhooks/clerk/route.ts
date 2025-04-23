import { db } from '@/lib/db';
import { UserJSON, WebhookEvent } from '@clerk/nextjs/server';
import { createId } from '@paralleldrive/cuid2';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error(
      'Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, return an error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred - no svix headers', { status: 400 });
  }

  // Get request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the secret key
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400,
    });
  }

  const eventType = evt.type;
  const userData = evt.data as UserJSON;

  if (eventType === 'user.created') {
    await db.user.create({
      data: {
        externalUserId: userData.id,
        username: userData.username || createId(),
        imageUrl: userData.image_url,
      },
    });
  }

  if (eventType === 'user.updated') {
    await db.user.update({
      where: {
        externalUserId: userData.id,
      },
      data: {
        username: userData.username || createId(),
        imageUrl: userData.image_url,
      },
    });
  }

  if (eventType === 'user.deleted') {
    await db.user.delete({
      where: {
        externalUserId: userData.id,
      },
    });
  }

  return new Response('OK', { status: 200 });
}
