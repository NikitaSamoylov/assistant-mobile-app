'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { ReactNode, useEffect, useRef, useState } from "react";
import { PopupMenu } from "@/components/Popups/PopupMenu";
import { EditProductItem } from "../../components/EditProductItem";
import { DeleteProductItem } from "@/components/DeleteProductItem";
import { AddToBuyItem } from "@/components/AddToBuyItem";
import { EditPopupForm } from "../../components/EditProductItem";
import { TProduct } from "@/lib/types/product";
import { TProductsTabs } from "@/lib/types/productsTabs";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import styles from './ProductsPageContent.module.css';

type TItemBtnProps = {
  children: ReactNode;
  productIds: TProduct[];
  isLast: boolean;
  activeTab?: TProductsTabs;
  pullData: VoidFunction;
};

export const ItemBtn = ({ children, productIds, isLast, activeTab, pullData }: TItemBtnProps) => {
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
          activeTab === TProductsTabs.FRESH &&
          {
            bottom: '-100px'
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
            activeTab !== TProductsTabs.FRESH && (
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
    </div>
  )
};