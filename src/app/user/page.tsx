import React from 'react';
import UserProfile from './userProfile';

export default function LoginPage() {
  return (
    <div className="min-h-[90vh]">
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold mb-4">Login</h1>
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
