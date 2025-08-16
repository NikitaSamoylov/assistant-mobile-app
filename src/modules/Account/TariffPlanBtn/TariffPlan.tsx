'use client';

import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { IoIosArrowForward } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { Pathes } from '@/lib/types/pathes';
import styles from './TariffPlanBtn.module.css';

export const TariffPlanBtn = () => {
  const router = useRouter();

  const handleRoute = () => {
    router.push(Pathes.TARIFF_PLAN);
  };

  return (
    <>
      <ActionBtn
        variant="icon"
        style={{ transform: 'translateY(2px)' }}
        action={handleRoute}
        color="button"
      >
        <IoIosArrowForward className={styles.icon} />
      </ActionBtn>
    </>
  )
};