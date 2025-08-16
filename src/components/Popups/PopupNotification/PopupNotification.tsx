'use client';

import classNames from 'classnames';
import { ActionBtn } from '../../Buttons/ActionBtn';
import { TextField } from '../../TextField';
import { FadeComponent } from '../../AnimatedComponents/FadeComponent';
import styles from './PopupNotification.module.css';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type TPopupProps = {
  isVisible: boolean;
  title: string;
  btnTitle?: string;
  subTitle?: string | ReactNode;
  btnSecondTitle?: string;
  action?: () => void;
  secondBtnAction?: () => void;
  component?: ReactNode | null;
  hideActions?: boolean;
};

export const PopupNotification = ({
  title = 'Уведомление',
  subTitle,
  btnTitle = 'Ок',
  btnSecondTitle,
  action,
  secondBtnAction,
  isVisible,
  component,
  hideActions = false,
}: TPopupProps) => {
  const [isOneBtn, setIsOneBtn] = useState(true);

  useEffect(() => {
    if (btnSecondTitle && secondBtnAction) {
      return setIsOneBtn(false);
    };
    return setIsOneBtn(true);
  }, [isOneBtn]);

  return createPortal(
    <FadeComponent isVisible={isVisible}>
      <div className={styles.popupBg} >
        <article className={styles.popup} >
          <div className={styles.popupTitle} >
            <TextField variant="h3" color="subTitle">
              {title}
            </TextField>
          </div>
          <div className={styles.popupSubTitle}>
            <TextField variant="span" color="main" >
              {subTitle}
            </TextField>
            {component}
          </div>
          {
            !hideActions && (
              <div className={styles.actions}>
                <div className={
                  classNames(
                    styles.actionBtn,
                    styles.confirmBtn,
                    isOneBtn && styles.btnIsOne
                  )
                }>
                  <ActionBtn
                    variant="background"
                    color="paper"
                    style={{ fontWeight: 600 }}
                    action={action}
                  >
                    {btnTitle}
                  </ActionBtn>
                </div>
                {
                  (!isOneBtn && secondBtnAction) && (
                    <div className={styles.actionBtn}>
                      <ActionBtn
                        variant="background"
                        color="paper"
                        style={{ fontWeight: 400 }}
                        action={secondBtnAction}
                      >
                        {btnSecondTitle}
                      </ActionBtn>
                    </div>
                  )
                }
              </div>
            )
          }
        </article>
      </div>
    </FadeComponent>,
    document.body
  )
};