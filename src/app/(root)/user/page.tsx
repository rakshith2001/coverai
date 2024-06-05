// src/app/(root)/user/page.tsx
import { auth } from "@clerk/nextjs";
import User from "@/components/shared/User";
import { redirect } from "next/navigation";

const UserPage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  return <User userId={userId} />;
};

export default UserPage;
