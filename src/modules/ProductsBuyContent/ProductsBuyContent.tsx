'use client';

import { SectionWrapper } from '@/components/SectionWrapper';
import { TextField } from '@/components/TextField';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { GroupActionBtn } from './GroupActionBtn';
import { IoIosMore } from 'react-icons/io';
import { useEffect, useLayoutEffect, useState } from 'react';
import { TBuyProducts } from '@/lib/types/product';
import { ListItem } from './ListItem';
import { CreateNewItem } from './CreateNewItem';
import { AnimatePresence, motion } from 'framer-motion';
import { animationConfig } from './config';
import classNames from 'classnames';
import { getShoppingProducts, saveShoppingProducts } from '@/lib/storage/indexedDb/productsToBuy';
import { ShareList } from './ShareList';
import { useDispatch } from 'react-redux';
import { setBackup } from '@/lib/store/features/backupSlice';
import styles from './ProductsBuyContent.module.css';

const SCROLL_HEIGHT = 119;

export const ProductsBuyContent = () => {
  const [isScrolled, setIsScrolled] = useState(0);
  const [data, setData] = useState<TBuyProducts[]>([]);

  const dispatch = useDispatch();

  const handleScroll = () => { // привязываем sticky header
    if (window.scrollY > 100) {
      setIsScrolled(window.scrollY);
    } else {
      setIsScrolled(0);
    };
  };

  useLayoutEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  //==============================================================

  //get data from indexed db
  const pullData = async () => {
    const localData = await getShoppingProducts();
    const itemsChecked = [
      ...localData.filter(item => item.isBought === false),
      ...localData.filter(item => item.isBought === true)
    ]; // находим isBought и помещаем их вниз
    setData(itemsChecked);
  };

  useEffect(() => {
    pullData();
  }, []);

  const markItemAsBought = async (elem: TBuyProducts) => {
    if (!data?.length) return;

    let dto: TBuyProducts[] = [];

    if (elem.isBought === true) {
      dto = [
        { ...elem, isBought: false },
        ...data.filter(item => item._id !== elem._id),
      ];
      await saveShoppingProducts(dto);
      await pullData();
      dispatch(setBackup(true));
    } else {
      dto = [
        ...data.filter(item => item._id !== elem._id),
        { ...elem, isBought: true },
      ];
      await saveShoppingProducts(dto);
      await pullData();
      dispatch(setBackup(true));
    };
  };

  return (
    <SectionWrapper>
      <FadeComponent isVisible={true}>
        <div id="buyPageHeader" className={classNames(isScrolled >= SCROLL_HEIGHT
          && `${styles.headerScrolled} ${styles.sectionScrolled}`)} >
          <div className={styles.headerTitle}>
            <TextField variant="h1" color="title">
              На покупку
            </TextField>
            <div className={styles.actionsWrapper}>
              <FadeComponent isVisible={data?.length > 0}>
                <ShareList data={data} />
              </FadeComponent>
              <GroupActionBtn
                data={data}
                pullData={pullData}
              >
                <IoIosMore className={styles.iconBtn} />
              </GroupActionBtn>
            </div>
          </div>
          <FadeComponent isVisible={true}>
            <CreateNewItem
              pullData={pullData}
              data={data}
            />
          </FadeComponent>
        </div>
        <ul className={styles.list}>
          <AnimatePresence>
            {
              data?.length && data.map(item => (
                <motion.div
                  key={item?._id}
                  layout
                  {...animationConfig}
                >
                  <ListItem key={item?._id}
                    item={item as TBuyProducts}
                    markItemAsBought={markItemAsBought}
                    data={data}
                    pullData={pullData}
                  />
                </motion.div>
              )) || []
            }
          </AnimatePresence>
        </ul>
      </FadeComponent>
    </SectionWrapper>
  )
};