import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import HomeChatClient from "./HomeChatClient";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userName = session.user.name?.split(" ")[0] || session.user.email?.split("@")[0] || "";

  return <HomeChatClient userName={userName} />;
}
