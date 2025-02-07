'use client';

import toast from 'react-hot-toast';
import { createPortalSession } from './portalAction';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function PortalButton() {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw 'Please login to view your billing portal';
      }

      const { data: customer } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single();

      const { url } = await createPortalSession(customer?.stripe_customer_id);

      router.push(url);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create billing portal');
    }
  };

  return (
    <button className="btn btn-primary my-3" onClick={handleClick}>
      Manage Billing
    </button>
  );
}
