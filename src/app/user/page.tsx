import React from 'react';
import LoginForm from './loginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold mb-4">Login</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
