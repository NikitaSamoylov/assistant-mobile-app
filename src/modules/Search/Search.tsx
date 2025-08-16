/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { SectionWrapper } from "@/components/SectionWrapper";
import { SearchInput } from "./SearchInput";
import { SearchResultList } from "./SearchResultList";
import { useEffect, useState } from "react";
import { getProductsFromIDB } from "@/lib/storage/indexedDb/existingProducts";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "@/lib/store/features/existingProductsSearchSlice";
import { RootState } from "@/lib/store/store";
import { usePathname } from "next/navigation";
import moment from "moment";

export const Search = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { pullFromIDB } = useSelector((state: RootState) => state.updateExistingProducts);

  const [text, setText] = useState('');

  useEffect(() => {
    setText('')
  }, [pathname]);

  const pullData = async () => {
    await getProductsFromIDB('all', text)
      .then((data) => {
        dispatch(setValue(data?.sort((a, b) => (
          moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
        ))));
      })
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