'use client';

import { TextField } from "@/components/TextField";
import classNames from "classnames";
import { TBuyProducts } from "@/lib/types/product";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { deleteProductsFromShopping } from "@/lib/storage/indexedDb/productsToBuy";
import styles from './DeleteActionBtn.module.css';
import { useDispatch } from "react-redux";
import { setBackup } from "@/lib/store/features/backupSlice";

type TProps = {
  handleOpen: VoidFunction;
  isItemLast: boolean;
  checked: TBuyProducts[];
  setShowDeleteMsg: (val: boolean) => void;
};

export const DeleteActionBtn = ({
  handleOpen,
  setShowDeleteMsg,
  isItemLast = false,
  checked,
}: TProps) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!checked.length) return;

    await deleteProductsFromShopping(checked);
    dispatch(setBackup(true));
    setShowDeleteMsg(true);
    handleOpen();
  };

  return (
    <div
      className={classNames(styles.listItemBtn, isItemLast ? styles.isItemLast : {})}
      onClick={handleDelete}
    >
      <TextField variant="p" color="error">
        Удалить выбранные
      </TextField>
      <MdOutlinePlaylistRemove
        className={classNames(
          styles.listItemBtnIcon,
          styles.deleteListItemIcon,
        )}
      />
    </div>
  )
};