// src/app/page.tsx
"use client";

import { useEffect } from "react";

const VAPID_PUBLIC_KEY = "BHCstLUaRnN7ATTgaIYBUaBBWfPOi_wwJPE5Z5SxkQ6wERzm6n6pdY6UBrr3YEmf2ppPaFSLuHi7YrnXXJ5RjZQ";

const urlBase64ToUint8Array = (base64String: string) => {

  // console.log(`urlBase64ToUint8Array base64String : ${base64String}`);

  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
};

export default function HomePage() {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, []);

  const subscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    console.log("Subscribed!");
  };

  const permission = async() => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // subscribeUserToPush();
    } else {
      console.error('Notification permission denied.');
    }
  };

  const getVapidPublicKey = async(): Promise<string> => {
    const response = await fetch('http://localhost:3002/vapid-public-key');
    const data = await response.json();

    console.log(`getVapidPublicKey publicKey : ${data.publicKey}`);

    return String(data.publickey);
  }

  const subscribeToPush = async() => {
    try {
      const publicKey = await getVapidPublicKey();
      const registration = await navigator.serviceWorker.register('/sw.js');

      console.log('subscribeToPush publicKey : ', publicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const response = await fetch('http://localhost:3002/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      // 응답이 성공적으로 처리되었는지 확인
      if (response.ok) {
        console.log('User subscribed to push notifications:', subscription);
      } else {
        console.error('Failed to subscribe:', response.statusText);
      }
    } catch (error) {
      // 오류 처리
      console.error('Error subscribing to push notifications:', error);
    }
  }

  const sendPush = async() => {
    try {
      const response = await fetch('http://localhost:3002/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({title: 'title', body: 'message'}),
      });

      if (response.ok) {
        console.log('send push');
      } else {
        console.error('Failed to subscribe:', response.statusText);
      }

    } catch (error) {
      // 오류 처리
      console.error('Error send push to push notifications:', error);
    }
  }

  return (
    <div>
      <h1>Web Push Notifications</h1>
      <button onClick={permission} className='subscribe-button'>Push 권한</button>
      <br />
      <button onClick={subscribeToPush} className='subscribe-button'>구독</button>
      <br />
      <button onClick={sendPush} className='subscribe-button'>Push Send</button>
    </div>
  );
}