// src/app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import webPush from 'web-push';

// Replace these with your generated keys
const VAPID_PUBLIC_KEY = '<your-public-key>';
const VAPID_PRIVATE_KEY = '<your-private-key>';

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  "BHCstLUaRnN7ATTgaIYBUaBBWfPOi_wwJPE5Z5SxkQ6wERzm6n6pdY6UBrr3YEmf2ppPaFSLuHi7YrnXXJ5RjZQ",
  "IrZLgGks4nymSMG94i8EcmBEfSZR2R8cA9Dl4DjNvvs"
);

let subscriptions: any[] = []; // Store subscriptions (use a database for production)

export async function POST(req: NextRequest) {
  const subscription = await req.json();
  subscriptions.push(subscription);

  console.log("Post send");

  return NextResponse.json({ message: 'Subscription added successfully.' });
}

export async function GET() {
  // Send notifications to all subscribers
  const notificationPayload = {
    title: 'Hello!',
    message: 'This is a test push notification.',
  };

  console.log("Get send");

  for (const subscription of subscriptions) {
    await webPush.sendNotification(
      subscription,
      JSON.stringify(notificationPayload)
    );
  }

  return NextResponse.json({ message: 'Notifications sent.' });
}