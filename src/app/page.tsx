import { authOptions } from "@/lib/auth";
import Subscriptions from "./_components/Subscriptions";
import Signout from "./_components/Signout";
import Signin from "./_components/Signin";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  // console.log(session);
  return (
    <div>
    <div className="items-center flex flex-col justify-center">
      {session?.user ? <Signout /> : <Signin />}
      <h1>
        {session?.user
          ? <Subscriptions/>
          : "Signin to see something jhakkass"}
      </h1>
    </div>
  </div>
  );
}
