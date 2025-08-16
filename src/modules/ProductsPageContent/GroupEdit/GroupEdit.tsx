'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { AnimatePresence, motion } from "framer-motion";
import { animationConfig } from "./config";
import { TProduct } from "@/lib/types/product";
import { useEffect } from "react";

type TProps = {
  isGroupEditMode: boolean | null;
  activeTab: string;
  setIsGroupEditMode: (val: boolean | null) => void;
  existingProducts: TProduct[];
};

export const GroupEdit = ({ setIsGroupEditMode, isGroupEditMode, activeTab, existingProducts }: TProps) => {
  const isEditMode = !!isGroupEditMode;

  useEffect(() => {
    if (existingProducts?.length <= 1) {
      setIsGroupEditMode(null);
      return;
    };
  }, [existingProducts]);

  return (
    <div style={{ display: 'inline-block' }}>
      <AnimatePresence mode="wait">
        {isEditMode ? (
          <motion.div
            key="cancel"
            {...animationConfig}
          >
            <ActionBtn
              variant="text"
              action={() => setIsGroupEditMode(null)}
              style={{ width: '79px' }}
            >
              Отменить
            </ActionBtn>
          </motion.div>
        ) : (
          <motion.div
            key="select"
            {...animationConfig}
          >
            <ActionBtn
              variant="text"
              action={() => setIsGroupEditMode(true)}
              style={{ width: '79px' }}
            >
              Выбрать
            </ActionBtn>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
};