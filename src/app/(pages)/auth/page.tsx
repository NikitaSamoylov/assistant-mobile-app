import { Pathes } from "@/lib/types/pathes";
import { Auth } from "@/modules/Auth";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AuthPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) { redirect(Pathes.MAIN) };

  return <Auth />;
};

export default AuthPage;