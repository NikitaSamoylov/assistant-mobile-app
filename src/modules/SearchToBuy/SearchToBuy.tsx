'use client';

import { SectionWrapper } from "@/components/SectionWrapper";
import { SearchResultList } from "./SearchResultList";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "@/lib/store/features/existingProductsSearchSlice";
import { RootState } from "@/lib/store/store";
import { SearchInput } from "./SearchInput";
import { setToBuyValue } from "@/lib/store/features/toBuyProductsSearchSlice";
import { getShoppingProducts } from "@/lib/storage/indexedDb/productsToBuy";

export const SearchToBuy = () => {
  const dispatch = useDispatch();
  const { pullFromIDB } = useSelector((state: RootState) => state.updateExistingProducts);

  const [text, setText] = useState('');

  const pullData = async () => {
    await getShoppingProducts(text)
      .then((data) => {
        dispatch(setToBuyValue(data));
      });
  };

  useEffect(() => {
    if (!text) {
      dispatch(setValue([]));
      return;
    };
    pullData();
  }, [text, pullFromIDB]);

  return (
    <SectionWrapper>
      <SearchInput
        text={text}
        setText={setText}
      />
      <SearchResultList
        pullData={pullData}
      />
    </SectionWrapper>
  )
};