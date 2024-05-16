import { authOptions } from '@/lib/auth';
import db from '@/lib/db'
import { stripe } from '@/lib/stripe';
import { gettingEndDate } from '@/lib/utils/gettingEndDate';
import { getServerSession } from 'next-auth';
import React from 'react'

async function User() {
    const session = await getServerSession(authOptions);
    console.log("user Sub Id",session?.user?.stripeSubscriptionId);
    console.log(session);
    const subData = await stripe.subscriptions.retrieve(session?.user?.stripeSubscriptionId as string)
    // console.log(subData);
    const endDate = gettingEndDate(subData.current_period_end )

  return (
    <div>
        {subData.status}
        <h1>Ending at {endDate}</h1>
    </div>
  )
}

export default User