'use client';

import { signIn } from 'next-auth/react';

export default function LogInPage() {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn('discord')}>Sign in with Discord</button>
    </div>
  )
}