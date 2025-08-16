'use client';

import { TextField } from "@/components/TextField";
import classNames from "classnames";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { TBuyProducts } from "@/lib/types/product";
import { clearShoppingList } from "@/lib/storage/indexedDb/productsToBuy";
import styles from './DeleteListActionBtn.module.css';

type TProps = {
  data: TBuyProducts[];
  handleOpen: VoidFunction;
  isItemLast: boolean;
  checked: TBuyProducts[];
  pullData: () => void;
  setShowDeleteMsg: (val: boolean) => void;
};

export const DeleteListActionBtn = ({
  handleOpen,
  data,
  pullData,
}: TProps) => {
  const handleChange = async () => {
    await clearShoppingList();
    pullData();
    handleOpen();
  };

  const title = data.length > 1 ? 'Удалить все' : 'Удалить';

  return (
    <div
      className={styles.listItemBtn}
      onClick={handleChange}
    >
      <TextField variant="p" color="error">
        {title}
      </TextField>
      <IoIosRemoveCircleOutline
        className={classNames(
          styles.listItemBtnIcon,
          styles.deleteListItemIcon
        )}
      />
    </div>
  )
};