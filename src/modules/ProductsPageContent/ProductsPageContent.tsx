'use client';

import { SectionWrapper } from "@/components/SectionWrapper";
import { TextField } from "@/components/TextField";

import { ItemBtn } from "./ItemBtn";
import { IoIosMore } from "react-icons/io";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { TProduct } from "@/lib/types/product";
import { RootState } from "@/lib/store/store";
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import moment from "moment";
import 'moment/locale/ru';
import { TProductsTabs } from "@/lib/types/productsTabs";
import { Checkbox } from "./Checkbox";
import { ProductImg } from "@/components/ProductImg";
import { ProductsDate } from "@/components/ProductsDate";
import styles from './ProductsPageContent.module.css';

moment.locale('ru');

type TProps = {
  isGroupEditMode: boolean | null;
  checked: TProduct[];
  handleChecked: (id: TProduct) => void;
  activeTab: TProductsTabs;
  pullData: VoidFunction;
  existingProducts: TProduct[];
};

export const ProductsPageContent = ({
  isGroupEditMode,
  checked,
  handleChecked,
  activeTab,
  pullData,
  existingProducts,
}: TProps) => {
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  return (
    <SectionWrapper>
      <FadeComponent isVisible={isUserOnline !== null}>
        <ul className={styles.list}>
          {
            existingProducts?.length && existingProducts?.map((item, i) => {
              const isLast = (existingProducts?.length - 1 === i && existingProducts?.length > 3);
              return (
                <FadeComponent key={item._id} isVisible={true}>
                  <li className={styles.item} >
                    <div className={styles.textContainer}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={
                          classNames(
                            styles.mainInfoWrapper,
                            !isGroupEditMode || checked.some(elem => elem._id === item._id)
                              ? styles.itemChoosen
                              : styles.itemNotChoosen
                          )
                        }>
                          <ProductImg img={item?.img} />
                          <div>
                            <div className={styles.itemTitle}>
                              <TextField variant="p" color="main" >
                                {item.title}
                              </TextField>
                            </div>
                            <div className={styles.itemSubTitle}>
                              <div>
                                <ProductsDate
                                  dateString={item?.updatedAt || item?.createdAt}
                                  mode={item?.updatedAt ? 'updated' : 'created'}
                                />
                              </div>
                            </div>
                            <div className={styles.itemCaption}>
                              <ProductsDate dateString={item?.expiredDate} tillTo={true} />
                            </div>
                          </div>
                        </div>
                      </div>
                      {
                        !isGroupEditMode && (
                          <ItemBtn
                            productIds={[item as TProduct]}
                            isLast={isLast}
                            activeTab={activeTab}
                            pullData={pullData}
                          >
                            <IoIosMore className={styles.iconBtn} />
                          </ItemBtn>
                        )
                      }
                      {
                        isGroupEditMode && (
                          <Checkbox
                            elem={item as TProduct}
                            handleCheckbox={handleChecked}
                            checked={checked}
                          />
                        )
                      }
                    </div>
                  </li>
                </FadeComponent>
              )
            })
            || (
              <li className={styles.item} >
                <div className={classNames(styles.itemTitle, styles.item_isEmpty)}>
                  <TextField variant="p" color="main" >
                    Список пуст
                  </TextField>
                </div>
              </li>
            )
          }
        </ul>
      </FadeComponent>
    </SectionWrapper>
  )
};