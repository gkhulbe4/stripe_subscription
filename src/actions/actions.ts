"use server"

import db from "@/lib/db"

export async function createSub(formData:FormData){
    const name = formData.get("name") as string
    const id = formData.get("priceId") as string
    const price = parseFloat(formData.get("priceInCents") as string)
    const sub = await db.subscription.create({
        data: {
            name: name,
            priceId: id,
            priceInCents: price
        }
    })
    if(sub) console.log(sub);
}