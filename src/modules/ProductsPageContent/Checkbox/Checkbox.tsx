'use client';

import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import { TProduct } from "@/lib/types/product";
import styles from './Checkbox.module.css';

type TProps = {
  elem: TProduct;
  checked: TProduct[];
  handleCheckbox: (val: TProduct) => void;
};

export const Checkbox = ({ elem, checked, handleCheckbox }: TProps) => {
  const isItemsChecked = checked?.some(item => item._id === elem?._id);

  return (
    <button className={styles.checkboxWrapper} onClick={() => handleCheckbox(elem)}>
      <FadeComponent isVisible={!!isItemsChecked}>
        <IoIosArrowDropdownCircle className={styles.icon} />
      </FadeComponent>
    </button>
  )
};