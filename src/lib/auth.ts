import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { Adapter } from "next-auth/adapters";
import db from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { stripe } from "./stripe";

export const authOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  events: {
    signIn: async ({ user , isNewUser }) => {
      if(!isNewUser){
        return
      }
      await stripe.customers
        .create({
          email: user.email!,
          name: user.name!,
          address: {
            line1: "510 Townsend St",
            postal_code: "98140",
            city: "San Francisco",
            state: "CA",
            country: "US",
          },
        })
        .then(async (customer) => {
          return db.user.update({
            where: { id: user.id },
            data: {
              stripeCustomerId: customer.id,
            },
          });
        });
    },
  },
  callbacks: {
    async session({ session, user }) {
      session!.user!.id = user.id;
      session!.user!.stripeCustomerId = user.stripeCustomerId;
      session!.user!.stripeSubscriptionId = user.stripeSubscriptionId;
      const purchase = await db.purchase.findFirst({
        where: {
          userId: user.id
        },
        select: {
          subscriptionId: true,
          isActive: true
        }
      });
      if (purchase) {
        session!.user!.subscriptionId = purchase.subscriptionId;
        session!.user!.isActive = purchase.isActive
      }
      return session;
    },
  },
} satisfies NextAuthOptions;
