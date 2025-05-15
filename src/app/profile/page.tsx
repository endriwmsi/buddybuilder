import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Você não está logado</div>;
  }

  return <div>ProfilePage</div>;
};

export default ProfilePage;
