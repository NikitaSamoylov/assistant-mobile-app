'use client';

import { IconCaption } from '@/components/IconCaption';
import { Pathes } from '@/lib/types/pathes';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { IoIosStarOutline } from "react-icons/io";

export const LinkToMainPage = () => {
  const pathname = usePathname();
  const isCurrent = pathname === Pathes.MAIN;

  return (
    <NextLink
      href={Pathes.MAIN}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <IoIosStarOutline
        size="28px"
        color={isCurrent ? '#EF9797' : '#87888D'}
        style={{ transform: 'translateY(1px)' }}
      />
      <div>
        <IconCaption>
          Главная
        </IconCaption>
      </div>
    </NextLink>
  )
}