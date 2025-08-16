'use client';

import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { PopupMenu } from '@/components/Popups/PopupMenu';
import { DeleteActionBtn } from '../DeleteActionBtn';
import { TBuyProducts } from '@/lib/types/product';
import { DeleteListActionBtn } from '../DeleteListActionBtn';
import { PopupNotification } from '@/components/Popups/PopupNotification';
import styles from './GroupActionBtn.module.css';

type TProps = {
  children: ReactNode;
  data: TBuyProducts[];
  pullData: () => void;
};

export const GroupActionBtn = ({
  children,
  data,
  pullData,
}: TProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);

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

  const popupSubtitle = 'Выбранные продукты удалены';

  const showMessage = (
    <PopupNotification
      title="Готово"
      subTitle={popupSubtitle}
      btnTitle="Ок"
      action={() => {
        setShowDeleteMsg(false);
        pullData();
      }}
      isVisible={showDeleteMsg}
    />
  );

  const checked = data?.filter(elem => elem.isBought === true) || [];

  if (!data?.length) return null;

  return (
    <div style={{ position: 'relative' }}>
      {showMessage}
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
        anchor="left"
        style={{
          bottom: checked.length && checked.length !== data.length ?
            '-123px' :
            checked.length === data.length ?
              '-73px' :
              '-59px',
          right: '16px',
        }}
      >
        <ul className={styles.actions_list}>
          {
            checked?.length && (
              <li>
                <DeleteActionBtn
                  handleOpen={handleOpen}
                  checked={checked}
                  setShowDeleteMsg={setShowDeleteMsg}
                  isItemLast={!!checked.length && checked.length === data.length}
                />
              </li>
            ) || null
          }
          {
            ((data?.length && !checked?.length) || (checked?.length && checked.length !== data.length)) && (
              <li>
                <DeleteListActionBtn
                  handleOpen={handleOpen}
                  data={data}
                  checked={checked}
                  pullData={pullData}
                  setShowDeleteMsg={setShowDeleteMsg}
                  isItemLast={!!checked.length && checked.length === data.length}
                />
              </li>
            )
          }
        </ul>
      </PopupMenu>
    </div>
  )
};