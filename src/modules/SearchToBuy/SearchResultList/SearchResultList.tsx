'use client';

import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import { SectionWrapper } from "@/components/SectionWrapper";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { TextField } from "@/components/TextField";
import { IoIosMore } from "react-icons/io";
import { ProductImg } from "@/components/ProductImg";
import { ProductsDate } from "@/components/ProductsDate";
import { ListItemBtn } from "../ListItemBtn";
import { TBuyProducts, TProduct } from "@/lib/types/product";
import { saveShoppingProducts } from "@/lib/storage/indexedDb/productsToBuy";
import { AnimatePresence, motion } from "framer-motion";
import { ListItem } from "../ListItemBtn/ListItemBtn";
import styles from './SearchResultList.module.css';

export const animationConfig = {
  initial: { opacity: 0, x: 0 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.3 },
};

type TProps = {
  pullData: VoidFunction;
};

export const SearchResultList = ({ pullData }: TProps) => {
  const { toBuySearchValue } = useSelector((state: RootState) => state.toBuyProductsSearch)
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);

  const markItemAsBought = async (elem: TBuyProducts) => {
    if (!toBuySearchValue?.length) return;

    let dto: TBuyProducts[] = [];

    if (elem.isBought === true) {
      dto = [
        { ...elem, isBought: false },
        ...toBuySearchValue.filter(item => item._id !== elem._id),
      ];
      await saveShoppingProducts(dto);
      pullData();
    } else {
      dto = [
        ...toBuySearchValue.filter(item => item._id !== elem._id),
        { ...elem, isBought: true },
      ];
      await saveShoppingProducts(dto);
      pullData();
    };

    if (isUserOnline) {
      fetch('/api/buy', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          products: dto,
          markAsBought: true, //отправляем флаг, чтоб обновить только на покупку или убрать с покупки
        })
      })
        .then((data) => data.json())
        .then((resp) => saveShoppingProducts(resp.message)) //с сервера возвращается объект тот же, только isSent: true
    };
  };

  if (!toBuySearchValue.length) return null;

  return (
    <SectionWrapper>
      <ul className={styles.list}>
        <AnimatePresence>
          {
            toBuySearchValue?.length && toBuySearchValue.map(item => (
              <motion.div
                key={item?._id}
                layout
                {...animationConfig}
              >
                <ListItem key={item?._id}
                  item={item as TBuyProducts}
                  markItemAsBought={markItemAsBought}
                  data={toBuySearchValue}
                  pullData={pullData}
                />
              </motion.div>
            )) || []
          }
        </AnimatePresence>
      </ul>
    </SectionWrapper>
  )
};