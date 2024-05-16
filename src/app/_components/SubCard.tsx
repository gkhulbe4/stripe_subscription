"use client"
import { Subscription } from "@/models";
import axios from "axios";
import { toast } from "sonner";

function SubCard({ id, name, priceInCents, priceId }: Subscription) {

    async function buySubscription(){
        const subscriptionId = id
        console.log(subscriptionId);
        try{
            const res = await axios.post(`/api/subscription/${subscriptionId}/checkout`)
            console.log(res.data);
            window.location.assign(res.data.url)
          }catch(error){
            toast.error("An error occurred")
          }
        }
  return (
    <div
      key={id}
      className={`p-10 border-2 hover:cursor-pointer hover:bg-gray-700 hover:scale-105 duration-300  transition-all w-full max-w-[21rem] min-h-[22rem] bg-black text-white`}
      onClick={buySubscription}
    >
      <div className="font-bold text-3xl mb-2 capitalize">{name}</div>
      <div className="flex items-baseline mb-2">
        <div className="text-3xl mr-2">₹{priceInCents}</div> / Month
      </div>
      <ul className="list-disc pl-4 ">
        <li>Appointment scheduling</li>
        <li>Patient notification</li>
        <li>Create up to one office</li>
        <li>Description ...</li>
        <li>Description ....</li>
      </ul>
    </div>
  );
  }

export default SubCard;
