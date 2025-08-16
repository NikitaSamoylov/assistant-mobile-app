'use client';

import { TextField } from '@/components/TextField';
import { MdEditNote } from "react-icons/md";
import styles from './EditPopup.module.css';

type TProps = {
  handleEditOpen: VoidFunction;
  handleOpen: VoidFunction;
};

export const EditProductItem = ({ handleEditOpen, handleOpen }: TProps) => {
  const handleModalsOpened = () => {
    handleOpen();
    handleEditOpen();
  };

  return (
    <div onClick={handleModalsOpened}>
      <div className={styles.listItemBtn}>
        <TextField variant="p" color="main">
          Править
        </TextField>
        <MdEditNote className={styles.listItemBtnIcon} />
      </div>
    </div>
  )
};