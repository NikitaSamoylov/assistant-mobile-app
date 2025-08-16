/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ProductsPageContent } from '../ProductsPageContent';
import { TextField } from '@/components/TextField';
import { SectionWrapper } from '@/components/SectionWrapper';
import { PageContentDeadline } from '../PageContentDeadline';
import { PageContentExpired } from '../PageContentExpired';
import { GroupEdit } from '../GroupEdit';
import { GroupItemBtn } from '../GroupItemActionsBtn';
import { IoIosMore } from 'react-icons/io';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { TProduct } from '@/lib/types/product';
import classNames from 'classnames';
import { TProductsTabs } from '@/lib/types/productsTabs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { getProductsFromIDB } from '@/lib/storage/indexedDb/existingProducts';
import { setPullFromIDB } from '@/lib/store/features/updateExistingProductsSlice';
import moment from 'moment';
import { Recipes } from '../Recipes';
import styles from './TabsHeader.module.css';


const tabs = [
  { id: TProductsTabs.FRESH, label: 'Ещё годные' },
  { id: TProductsTabs.DEADLINE, label: 'До завтра' },
  { id: TProductsTabs.EXPIRED, label: 'Срок истёк' },
];

const SCROLL_HEIGHT = 119;

export const TabsHeader = () => {
  const [isScrolled, setIsScrolled] = useState(0);
  const [isGroupEditMode, setIsGroupEditMode] = useState<boolean | null>(null);
  const [checked, setChecked] = useState<TProduct[]>([]);
  const [activeTab, setActiveTab] = useState(TProductsTabs.DEADLINE);
  const [existingProducts, setExistingProducts] = useState<TProduct[]>([]);

  const dispatch = useDispatch();
  const rePullFromDB = useSelector((state: RootState) => state.updateExistingProducts.pullFromIDB);
  const { isGlobalSync } = useSelector((state: RootState) => state.isGlobalSync);

  const pullData = async () => {
    const localData = await getProductsFromIDB(activeTab as TProductsTabs)
    let sortedData;
    if (activeTab === TProductsTabs.FRESH) {
      sortedData = localData?.sort((a, b) => moment(a.expiredDate, 'DD.MM.YYYY').valueOf() - moment(b.expiredDate, 'DD.MM.YYYY').valueOf());
    } else {
      sortedData = localData?.sort((a, b) => moment(b.createdAt, 'DD.MM.YYYY').valueOf() - moment(a.createdAt, 'DD.MM.YYYY').valueOf());
    }
    setExistingProducts(sortedData || []);
    dispatch(setPullFromIDB(false));
  };

  //================================ voice recognition

  // const deleteProduct = async (productName: string) => {
  //   const data: TProduct[] = await getProductsFromIDB('all');
  //   const foundedProduct: TProduct[] = data.filter(elem => elem?.title.toLowerCase() == productName.toLocaleLowerCase());
  //   if (foundedProduct?.length) {
  //     await deleteProductsFromStore(foundedProduct);
  //     await pullData();
  //   } else {
  //     alert('not found')
  //   }
  // };

  // useEffect(() => {
  //   const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   if (!Recognition) {
  //     console.error('Speech Recognition API не поддерживается в этом браузере.');
  //     return;
  //   };

  //   const recognition = new Recognition();
  //   recognition.continuous = true;
  //   recognition.lang = 'ru-RU';

  //   recognition.onresult = (event: SpeechRecognitionEvent) => {
  //     for (let i = event.resultIndex; i < event.results.length; i++) {
  //       if (event.results[i].isFinal) {
  //         const transcript = event.results[i][0].transcript.toLowerCase().trim();

  //         if (transcript.includes('удалить продукт')) {
  //           // Используем регулярное выражение для извлечения названия после команды
  //           const match = transcript.match(/удалить продукт\s+(.+)/);
  //           if (match && match[1]) {
  //             const productName = match[1].trim(); // Название продукта
  //             deleteProduct(productName);
  //           }
  //         }
  //       }
  //     }
  //   };

  //   recognition.start();

  //   return () => {
  //     recognition.stop();
  //   };
  // }, []);

  //====================================

  useEffect(() => {
    if (isGlobalSync) return;
    pullData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); //этот запрос только при монтировании и при смене таба

  useEffect(() => {
    if (!rePullFromDB) return;
    pullData();
  }, [rePullFromDB]);

  const handleChecked = (elem: TProduct) => {
    if (checked.some(item => item._id === elem._id)) {
      return setChecked(checked.filter(item => item._id !== elem._id));
    }
    return setChecked([...checked, elem]);
  };

  useEffect(() => {
    if (isGroupEditMode === null) {
      setChecked([]);
    };
  }, [isGroupEditMode]);

  const handleActiveTab = (id: string) => {
    if (activeTab === id) return;

    setExistingProducts([]);
    setActiveTab(id as TProductsTabs);
    setIsGroupEditMode(null);
  };

  const handleScroll = () => { // привязываем sticky header
    if (window.scrollY > 100) {
      setIsScrolled(window.scrollY);
    } else {
      setIsScrolled(0);
    }
  };

  useLayoutEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <SectionWrapper>
        <div id="mainPageHeader" className={classNames(isScrolled >= SCROLL_HEIGHT
          && styles.headerScrolled)}
        >
          <div className={styles.headerTitle}>
            <TextField variant="h1" color="title">
              Продукты
            </TextField>
            <div className={styles.grouppedBtns}>
              <div>
                {
                  activeTab === TProductsTabs.DEADLINE &&
                  !isGroupEditMode &&
                  !!existingProducts?.length && (
                    <Recipes />
                  )
                }
              </div>
              <FadeComponent isVisible={(!!checked?.length)}>
                <GroupItemBtn
                  checked={checked}
                  activeTab={activeTab}
                  setIsGroupEditMode={setIsGroupEditMode}
                  isGroupEditMode={isGroupEditMode}
                  pullData={pullData}
                  existingProducts={existingProducts}
                >
                  <IoIosMore className={styles.iconBtn} />
                </GroupItemBtn>
              </FadeComponent>
              <FadeComponent isVisible={existingProducts?.length > 1}>
                <GroupEdit
                  setIsGroupEditMode={setIsGroupEditMode}
                  isGroupEditMode={isGroupEditMode}
                  activeTab={activeTab}
                  existingProducts={existingProducts}
                />
              </FadeComponent>
            </div>
          </div>
          <div className={classNames(styles.tabs,
            (isScrolled >= SCROLL_HEIGHT && styles.sectionScrolled))}>
            <div className={styles.tabHeader} >
              <ul className={styles.tabList}>
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={styles.tabItem}
                  >
                    <AnimatePresence>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className={classNames(
                          styles.tabBtn,
                          tab.id === activeTab &&
                          styles.tabBtn_active
                        )}
                        onClick={() => {
                          handleActiveTab(tab.id)
                        }}
                      >
                        {tab.label}
                      </motion.button>
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {
          activeTab === TProductsTabs.FRESH && (
            <ProductsPageContent
              isGroupEditMode={isGroupEditMode}
              checked={checked}
              handleChecked={handleChecked}
              activeTab={activeTab}
              pullData={pullData}
              existingProducts={existingProducts}
            />
          )}
        {activeTab === TProductsTabs.DEADLINE && (
          <PageContentDeadline
            isGroupEditMode={isGroupEditMode}
            checked={checked}
            handleChecked={handleChecked}
            activeTab={activeTab}
            pullData={pullData}
            existingProducts={existingProducts}
          />
        )}
        {activeTab === TProductsTabs.EXPIRED && (
          <PageContentExpired
            isGroupEditMode={isGroupEditMode}
            checked={checked}
            handleChecked={handleChecked}
            activeTab={activeTab}
            pullData={pullData}
            existingProducts={existingProducts}
          />
        )}
      </SectionWrapper>
    </>
  )
};