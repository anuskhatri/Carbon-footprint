'use client'
import axios from 'axios'
import { SignOutButton, useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Home() {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    getAccessToken()
  }, [isSignedIn])


  const getAccessToken = async () => {
    if (!isSignedIn) {
      console.log("User is not authenticated.");
      return;
    }
    try {
      const { data } = await axios.get(`http://localhost:3000/api/chat-bot`);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      hello
    </>
  );
}


