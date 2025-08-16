/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import { HalfScreenPopup } from '@/components/Popups/HalfScreenPopup';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { TextField } from "@/components/TextField";
import { DatePicker } from "@/components/Calendar";
import { useEffect } from 'react';
import { ControlledTextArea } from '@/components/ControlledInputs/ControlledTextArea';
import { TProduct } from '@/lib/types/product';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { saveProductsToIDB } from '@/lib/storage/indexedDb/existingProducts';
import { setPullFromIDB } from '@/lib/store/features/updateExistingProductsSlice';
import { setBackup } from '@/lib/store/features/backupSlice';
import styles from './EditPopup.module.css';

type TAddPopupProps = {
  isVisible: boolean;
  handleOpen: () => void;
  productId: TProduct[];
  setShowSuccessNotice: (val: boolean) => void;
  showSuccessNotice: boolean;
  handleEditOpen: VoidFunction;
  isEditModalOpen: boolean;
};

const schema = yup.object().shape({
  title: yup.string().max(63, 'до 63 символов').required('введите название'),
  expiredDate: yup.string().required('Годен до'),
});
const resolver = yupResolver(schema);

const BUTTON_TITLE = 'Обновить продукт';

export const EditPopupForm = ({
  isVisible,
  handleOpen,
  productId,
  setShowSuccessNotice,
  handleEditOpen,
  isEditModalOpen,
}: TAddPopupProps) => {
  const dispatch = useDispatch();
  const { userSession } = useSelector((state: RootState) => state.userSession);

  const camImg = productId[0]?.img;

  const methods = useForm<{ title: string; expiredDate: string }>({
    resolver,
    defaultValues: {
      title: productId[0].title || '',
      expiredDate: productId[0].expiredDate || '',
    },
  });

  useEffect(() => {
    if (!isVisible) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isVisible]);

  const onSubmit = async (data: { title: string; expiredDate: string }) => {
    if (!data?.title.trim()) return;

    const isoExpiredDate = moment(data.expiredDate, "DD.MM.YYYY").format("DD.MM.YYYY");
    const dto = {
      userId: userSession?.id,
      updatedProduct: [{
        ...productId[0], //добавляем все элементы в продукте
        title: data.title.trim(),
        expiredDate: isoExpiredDate,
        img: camImg,
        updatedAt: moment().format('DD.MM.YYYY'),
        isSent: false,
      }],
    };

    await saveProductsToIDB(dto.updatedProduct);
    dispatch(setPullFromIDB(true)); // as true signal
    dispatch(setBackup(true));
    setShowSuccessNotice(true);
    isEditModalOpen && handleEditOpen();
  };

  return (
    <HalfScreenPopup isVisible={isVisible} handleOpen={handleOpen}>
      <div className={styles.form}>
        <div className={styles.title}>
          <TextField variant="h1" color="main" >
            Обновить продукт
          </TextField>
        </div>
        <div>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ul className={styles.fieldsList}>
                <li className={styles.fieldItem}>
                  <ControlledTextArea name="title" placeholder="Название" rows={3} maxLength={63} />
                </li>
                <li className={styles.fieldItem}>
                  <DatePicker name="expiredDate" placeholder="Годен до" disabled />
                </li>
              </ul>
              <button className={styles.button} type="submit">
                {BUTTON_TITLE}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </HalfScreenPopup >
  )
};