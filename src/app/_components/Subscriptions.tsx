import db from "@/lib/db";
import { Subscription } from "@/models";
import React from "react";
import SubCard from "./SubCard";

async function Subscriptions() {
  const subscriptions = await db.subscription.findMany();
//   console.log(subscriptions);
  return (
    <>
    <h1 className="text-center font-bold text-xl">Click on the subscription to buy it</h1>
    <div className="flex w-full gap-3 mt-4 justify-center items-center">
      {subscriptions.map((subscription) => (
        <SubCard
          id={subscription.id}
          name={subscription.name}
          priceId={subscription.priceId}
          priceInCents={subscription.priceInCents}
        />
      ))}
    </div>
    </>
  );
}

export default Subscriptions;
