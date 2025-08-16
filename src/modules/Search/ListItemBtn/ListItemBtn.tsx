'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { ReactNode, useEffect, useRef, useState } from "react";
import { PopupMenu } from "@/components/Popups/PopupMenu";
import { AddToBuyItem } from "@/components/AddToBuyItem";
import { TProduct } from "@/lib/types/product";
import { TProductsTabs } from "@/lib/types/productsTabs";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { EditPopupForm, EditProductItem } from "@/components/EditProductItem";
import { detectProductTimeLeft } from "@/utils/detectProductTimeLeft";
import { DeleteProductItem } from "@/components/DeleteProductItem";
import styles from './ListItemBtn.module.css';

type TItemBtnProps = {
  children: ReactNode;
  productIds: TProduct[];
  isLast: boolean;
  pullData: VoidFunction;
};

export const ListItemBtn = ({ children, productIds, isLast, pullData }: TItemBtnProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSuccessNotice, setShowSuccessNotice] = useState(false);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const handleButtonPopup = () => {
    setIsOpen(isOpen => !isOpen);
  };

  const handleEditOpen = () => {
    setIsEditModalOpen(isEditModalOpen => !isEditModalOpen);
  };

  const handleClickOutside = (event: MouseEvent): void => {
    const target = event.target as Node;
    if (
      popupRef.current &&
      !popupRef.current.contains(target) &&
      buttonRef.current &&
      !buttonRef.current.contains(target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const SuccessPopup = (
    <PopupNotification
      title="Продукт обновлён"
      subTitle=""
      btnTitle="Ok"
      action={() => {
        setShowSuccessNotice(false);
        setIsOpen(false);
      }}
      isVisible={showSuccessNotice}
    />
  );

  const isFresh = detectProductTimeLeft(productIds[0].expiredDate) === TProductsTabs.FRESH;

  return (
    <div style={{ position: 'relative' }}>
      {SuccessPopup}
      <div ref={buttonRef}>
        <ActionBtn
          variant="icon"
          action={handleButtonPopup}
        >
          <div className={styles.iconBtnBorder} >
            <div className={styles.iconBtnWrapper} >
              {children}
            </div>
          </div>
        </ActionBtn>
      </div>
      <PopupMenu
        isOpen={isOpen}
        popupRef={popupRef}
        isLast={isLast}
        style={
          isFresh &&
          {
            bottom: '-93px'
          } || {}
        }
      >
        <ul className={styles.actions_list}>
          <li>
            <EditProductItem
              handleEditOpen={handleEditOpen}
              handleOpen={() => setIsOpen(false)}
            />
          </li>
          {
            !isFresh && (
              <li>
                <AddToBuyItem
                  productIds={productIds}
                  popupRef={popupRef}
                  pullData={pullData}
                />
              </li>
            )
          }
          <li>
            <DeleteProductItem
              productIds={productIds}
              popupRef={popupRef}
              pullData={pullData}
            />
          </li>
        </ul>
      </PopupMenu>
      <EditPopupForm // для редактирования попап
        isVisible={isEditModalOpen}
        handleOpen={handleEditOpen}
        productId={productIds}
        setShowSuccessNotice={setShowSuccessNotice}
        showSuccessNotice={showSuccessNotice}
        handleEditOpen={handleEditOpen}
        isEditModalOpen={isEditModalOpen}
      />
    </div >
  )
};