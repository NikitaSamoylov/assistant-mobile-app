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
import { TProduct } from "@/lib/types/product";
import styles from './SearchResultList.module.css';

type TProps = {
  pullData: VoidFunction;
};

export const SearchResultList = ({ pullData }: TProps) => {
  const { searchValue } = useSelector((state: RootState) => state.existingProductsSearch);

  if (!searchValue.length) return null;

  return (
    <SectionWrapper>
      {
        searchValue?.length > 0 && (
          <ul className={styles.list}>
            {searchValue.map((item, i) => {
              const isLast = (searchValue?.length - 1 === i && searchValue?.length > 3);
              return (
                <FadeComponent key={item._id} isVisible={true}>
                  <li className={styles.item} >
                    <div className={styles.textContainer}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={
                          classNames(
                            styles.mainInfoWrapper,
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
                                  dateString={item?.createdAt || item?.updatedAt}
                                  mode={item?.createdAt ? 'created' : 'updated'}
                                />
                              </div>
                            </div>
                            <div className={styles.itemCaption}>
                              <ProductsDate dateString={item?.expiredDate} tillTo={true} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <ListItemBtn
                        productIds={[item as TProduct]}
                        isLast={isLast}
                        pullData={pullData}
                      >
                        <IoIosMore className={styles.iconBtn} />
                      </ListItemBtn>
                    </div>
                  </li>
                </FadeComponent>
              )
            })}
          </ul>
        )
      }
    </SectionWrapper>
  )
};