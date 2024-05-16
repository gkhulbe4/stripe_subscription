import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(
    req: Request,
    { params }: { params: { subscriptionId: string } }
  ) {
    try {
      const userSession = await getServerSession(authOptions);
      const user = userSession?.user;
      // console.log("subId" , params.subscriptionId);
      if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      // console.log("UserId:",user.id);
      // console.log("customerId" , user.stripeCustomerId);

      const subscription = await db.subscription.findUnique({
        where: {
            id: params.subscriptionId
        },
        select: {
            priceId: true
        }
      })
      if(!subscription){
        return new NextResponse("Subscription not found", { status: 404 });
      }
      // console.log("priceId:",subscription.priceId);


      const newPurchaser = await db.purchase.findFirst({
        where: {
          userId: user.id
        }
      })

      if(newPurchaser){
        // console.log("not a new purchases");
        return new NextResponse("You are already subscribed to a plan", { status: 400 });
      }

      const purchase = await db.purchase.findUnique({
        where: {
          userId_subscriptionId: {
            userId: user?.id!,
            subscriptionId: params.subscriptionId,
          },
        },
      });
      if (purchase) {
        // console.log("already purchased");
        return new NextResponse("You have already subscribed to this plan", { status: 400 });
      }
      // console.log("new purchaser")

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          quantity: 1,
          price: subscription.priceId
        }, 
      ];
      console.log(line_items);
      const session = await stripe.checkout.sessions.create({
        customer: user.stripeCustomerId!,
        line_items,
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
        cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`,
        // subscription_data:{
          metadata: {
            subscriptionId: params.subscriptionId,
            userId: user.id,
          // },
        }
      });
  
      return NextResponse.json({ url: session.url });
    } catch (error) {
      return new NextResponse("An error occurred", { status: 500 });
    }
  }


