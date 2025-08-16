'use client';

import { setIsCheckBackup } from "@/lib/store/features/isCheckingBackupSlice";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

type TDto = {
  email?: string;
  phone?: string;
  verificationCode: string;
  callbackUrl: string;
};

export const useSignIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const verifyAndSignIn = async (dto: TDto) => {
    setIsLoading(true);
    setIsError(null);

    try {
      const result = await signIn("credentials", {
        ...dto,
        verificationCode: dto.verificationCode,
        redirect: false,
      });
      if (result?.error) {
        setIsError(result.error);
        return false;
      }

      if (result?.ok) {
        dispatch(setIsCheckBackup(true));
        router.replace(dto.callbackUrl);
        return true;
      };
    } catch (err) {
      setIsError("Ошибка при входе");
      console.error("SignIn error:", err);
    } finally {
      setIsLoading(false);
    };

    return false;
  };

  return { verifyAndSignIn, isLoading, isError, setIsError };
};