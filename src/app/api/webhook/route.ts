import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import db from "@/lib/db";
import { NextResponse } from "next/server";
import "dotenv/config";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const subscriptionId = session?.metadata?.subscriptionId;
  const stripeSubscriptionId = session?.subscription
  console.log("SUBBBBBBBBBBB" , stripeSubscriptionId);

  if (event.type === "checkout.session.completed") {
    if (!userId || !subscriptionId || !stripeSubscriptionId) {
      return new NextResponse(`Webhook Error: Missing metadata`, {
        status: 400,
      });
    }
    const updateUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeSubscriptionId: stripeSubscriptionId as string,
      },
    });
    console.log("user updated");
    const updatePurchases = await db.purchase.create({
      data: {
        userId: userId!,
        subscriptionId: subscriptionId!,
        isActive: true,
      },
    });
    console.log("purchases updated");
  } else {
    return new NextResponse(
      `Webhook Error: Unsupported event type ${event.type}`,
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 200 });
}
