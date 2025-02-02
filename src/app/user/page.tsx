import React from 'react';
import UserProfile from './userProfile';

export default function LoginPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold mb-4">Login</h1>
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
