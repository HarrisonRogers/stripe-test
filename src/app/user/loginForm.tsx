'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);

    const randomEmail =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      '@example.com';

    const password = 'password123456789';

    try {
      const { data, error } = await supabase.auth.signUp({
        email: randomEmail,
        password,
      });

      if (error) {
        throw error;
      }

      console.log('Sign up successful:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-primary w-full"
      onClick={handleSignUp}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner"></span>
          Loading...
        </>
      ) : (
        'Sign Up'
      )}
    </button>
  );
}

export default LoginForm;
