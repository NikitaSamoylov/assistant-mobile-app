'use client';

import { SectionWrapper } from "@/components/SectionWrapper";
import { ReturnBtn } from "@/components/Buttons/ReturnBtn";
import { useRouter } from "next/navigation";
import { Pathes } from "@/lib/types/pathes";
import { TextField } from "@/components/TextField";
import { MenuItem } from "@/components/MenuItem";
import { MdTipsAndUpdates } from "react-icons/md";
import { MdRunningWithErrors } from "react-icons/md";
import { HalfScreenPopup } from "@/components/Popups/HalfScreenPopup";
import { useState } from "react";
import { GiftsContent } from "./GiftContentErrorsTips";
import { GiftContentLifeHacks } from "./GiftContentLafeHacks";
import styles from './Gifts.module.css';

export const Gifts = () => {
  const [isLifeHacksVisible, setIsLifeHacksVisible] = useState(false);
  const [isErrorsTipsVisible, setIsErrorsTipsVisible] = useState(false);

  const router = useRouter();

  const handlePopup = () => {
    if (isLifeHacksVisible) {
      setIsLifeHacksVisible(false);
    };
    if (isErrorsTipsVisible) {
      setIsErrorsTipsVisible(false);
    };
  };

  const handleRoute = () => {
    router.push(Pathes.MENU_LIST);
  };

  const handleLifeHacks = () => {
    setIsLifeHacksVisible(isLifeHacksVisible => !isLifeHacksVisible);
    if (isErrorsTipsVisible) setIsErrorsTipsVisible(false);
  };

  const handleErrorsTips = () => {
    setIsErrorsTipsVisible(true);
    if (isLifeHacksVisible) setIsLifeHacksVisible(false);
  };

  return (
    <>
      <SectionWrapper>
        <div className={styles.returnBtn}>
          <ReturnBtn action={handleRoute} />
        </div>
        <div className={styles.title}>
          <TextField variant="h1" color="main">
            Бонусы
          </TextField>
        </div>
        <MenuItem
          action={handleLifeHacks}
          icon={<MdTipsAndUpdates className={styles.lifeHackIcon} />}
          title="Лайфхаки шеф-поваров"
        />
        <MenuItem
          action={handleErrorsTips}
          icon={<MdRunningWithErrors className={styles.errorsIcon} />}
          title="Ошибки 9/10 хозяек"
        />
      </SectionWrapper>
      <HalfScreenPopup isVisible={isLifeHacksVisible || isErrorsTipsVisible} handleOpen={handlePopup} height="82vh">
        {isLifeHacksVisible && <GiftContentLifeHacks />}
        {isErrorsTipsVisible && <GiftsContent />}
      </HalfScreenPopup>
    </>
  )
};