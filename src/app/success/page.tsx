import Link from 'next/link';
import React from 'react';

function page() {
  return (
    <div>
      <h1>Success</h1>
      <Link href="/user">Go see you stripe payment details</Link>
    </div>
  );
}

export default page;
