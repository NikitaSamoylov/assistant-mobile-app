import { Pathes } from "@/lib/types/pathes";
import { VerifyCode } from "@/modules/VerifyCode";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Verify = async () => {
  const session = await getServerSession(authOptions);

  if (session) redirect(Pathes.MAIN);

  return (
    <VerifyCode />
  )
};

export default Verify;