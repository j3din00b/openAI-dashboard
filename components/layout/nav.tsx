import Navbar from "./navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GET, GETCACHED }  from "@/app/api/userInfo/router"

export default async function Nav() {
  const session = await getServerSession(authOptions);
  // const openai = await GET().then(e => e.json())
  const openai = await GETCACHED()

  return <Navbar session={session} openai={openai}/>;
}
