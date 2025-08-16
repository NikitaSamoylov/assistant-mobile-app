'use client';

import NextImage from 'next/image';
import { SectionWrapper } from "@/components/SectionWrapper";
import { TextField } from "@/components/TextField";
import { RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from 'react';
import { Pathes } from '@/lib/types/pathes';
import styles from './Fallback.module.css';

import Image from './no-internet.png';

export const Fallback = () => {
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  const router = useRouter();

  useEffect(() => {
    if (isUserOnline) {
      router.replace(Pathes.MAIN);
    };
  }, [isUserOnline]);

  return (
    <SectionWrapper>
      <div className={styles.wrapper}>
        <NextImage
          src={Image}
          width={110}
          height={110}
          alt="Без интернета"
        />
        <TextField variant="h1" color="main" style={{ marginTop: '15px', textAlign: 'center' }}>
          Без доступа <br /> к интернету
        </TextField>
      </div>
    </SectionWrapper>
  )
};