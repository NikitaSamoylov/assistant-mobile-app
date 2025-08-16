'use client';

import { ReactNode, useEffect, useRef, useState } from "react";
import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { PopupMenu } from "@/components/Popups/PopupMenu";
import { AddToBuyItem } from "../../../components/AddToBuyItem/AddToBuyItem";
import { DeleteProductItem } from "../../../components/DeleteProductItem/DeleteProductItem";
import { TProduct } from "@/lib/types/product";
import { TProductsTabs } from "@/lib/types/productsTabs";
import styles from './GroupItemBtn.module.css';

type TItemBtnProps = {
  children?: ReactNode;
  productId?: string;
  imgUrl?: string;
  checked: TProduct[];
  activeTab: string;
  setIsGroupEditMode: (val: boolean | null) => void;
  isGroupEditMode: boolean | null;
  pullData: VoidFunction;
  existingProducts: TProduct[];
};

export const GroupItemBtn = ({
  children,
  checked,
  setIsGroupEditMode,
  existingProducts,
  pullData,
  activeTab,
}: TItemBtnProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = () => {
    setIsOpen(isOpen => !isOpen);
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

  useEffect(() => {
    if (existingProducts?.length <= 1) {
      setIsGroupEditMode(null);
      return;
    };
  }, [existingProducts]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={buttonRef}>
        <ActionBtn
          variant="icon"
          action={handleOpen}
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
        anchor="bottom"
        style={activeTab === TProductsTabs.FRESH ? {
          bottom: '-56px'
        } : {}}
      >
        <ul className={styles.actions_list}>
          {
            activeTab !== TProductsTabs.FRESH && (
              <li>
                <AddToBuyItem
                  productIds={checked}
                  popupRef={popupRef}
                  pullData={pullData}
                />
              </li>
            )
          }
          <li>
            <DeleteProductItem
              productIds={checked}
              popupRef={popupRef}
              pullData={pullData}
            />
          </li>
        </ul>
      </PopupMenu>
    </div>
  )
};