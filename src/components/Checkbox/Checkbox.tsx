'use client';

import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FadeComponent } from "../AnimatedComponents/FadeComponent";
import { TBuyProducts, TProduct } from "@/lib/types/product";
import styles from './Checkbox.module.css';

type TProps<T> = {
  elem: T;
  checked?: boolean;
  checkedItems?: T[];
  markItemAsBought: (val: T) => void;
};

export const Checkbox = <T extends TProduct | TBuyProducts>({
  elem, checked = false, markItemAsBought, checkedItems,
}: TProps<T>) => {
  const handleCheckbox = () => {
    return markItemAsBought(elem as T);
  };

  return (
    <button className={styles.checkboxWrapper} onClick={handleCheckbox}>
      <FadeComponent isVisible={(!!checkedItems || !!checked)}>
        <IoIosArrowDropdownCircle className={styles.icon} />
      </FadeComponent>
    </button>
  )
};