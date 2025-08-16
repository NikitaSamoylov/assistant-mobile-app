'use client';

import { HalfScreenPopup } from '@/components/Popups/HalfScreenPopup';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { TextField } from "@/components/TextField";
import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { DatePicker } from "@/components/Calendar";
import { useEffect, useState } from 'react';
import { ControlledTextArea } from '@/components/ControlledInputs/ControlledTextArea';
import { FaChevronCircleDown } from "react-icons/fa";
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { v4 as uuidv4 } from 'uuid';
import { usePathname } from 'next/navigation';
import { Pathes } from '@/lib/types/pathes';
import { getProductsFromIDB, saveProductsToIDB } from '@/lib/storage/indexedDb/existingProducts';
import { convertAndCompresse } from '@/utils/compresseImg';
import { LIMIT } from '@/lib/consts/consts';
import { setPullFromIDB } from '@/lib/store/features/updateExistingProductsSlice';
import { FaCameraRetro } from "react-icons/fa";
import { setBackup } from '@/lib/store/features/backupSlice';
import { useRouter } from 'next/navigation';
import { setImg } from '@/lib/store/features/addProductSlice';
import styles from './AddItem.module.css';
import { GuideBtn } from '../GuideBtn';

type TAddPopupProps = {
  isVisible: boolean;
  productIsAdded: boolean;
  handleOpen: () => void;
  setShowLimitPopup: (val: boolean) => void;
  setShowSuccessNotice: (val: boolean) => void;
  setProductIsAdded: (val: boolean) => void;
};

const schema = yup.object().shape({
  title: yup.string().max(63, 'до 63 символов').required('введите название'),
  expiredDate: yup.string().required('Годен до'),
});
const resolver = yupResolver(schema);

const BTN_TITLE = 'Добавить';

export const PopupForm = ({
  isVisible,
  handleOpen,
  setShowSuccessNotice,
  productIsAdded,
  setProductIsAdded,
  setShowLimitPopup,
}: TAddPopupProps) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { userSession } = useSelector((state: RootState) => state.userSession);
  const camData = useSelector((state: RootState) => state.addProduct.addProduct);

  const camImg = camData?.img;

  const methods = useForm<{ title: string; expiredDate: string }>({
    resolver,
    defaultValues: {
      title: '',
      expiredDate: '',
    },
  });

  const [isProductsLimit, setIsProductsLimit] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      const localProducts = await getProductsFromIDB('all');
      if (localProducts?.length >= LIMIT) {
        setIsProductsLimit(true);
      } else {
        setIsProductsLimit(false);
      };
    };

    getProducts();
  }, []);

  const handleOpened = () => {
    router.replace(Pathes.WEB_CAM);
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    };

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  const onSubmit = async (data: { title: string; expiredDate: string }) => {
    if (isProductsLimit) {
      methods.reset();
      dispatch(setImg(''));
      setShowLimitPopup(true);
      return;
    };

    if (!data?.title.trim()) {
      return;
    };

    const isoExpiredDate = moment(data.expiredDate, "DD.MM.YYYY").format("DD.MM.YYYY");

    const preparedImg = await convertAndCompresse(camImg as string);

    const dtoDefault = {
      userId: userSession?.id as string,
      products: [{
        _id: uuidv4(),
        title: data.title.trim(),
        expiredDate: isoExpiredDate,
        img: preparedImg,
        createdAt: moment().format("DD.MM.YYYY"),
      }],
    };

    //добавляем в indexedDB
    await saveProductsToIDB(dtoDefault.products);
    dispatch(setBackup(true));
    setShowSuccessNotice(true);
    methods.reset();
    dispatch(setImg(''));

    dispatch(setPullFromIDB(true)) // as true signal
  };

  const handlePopupClose = () => {
    handleOpen();
    setProductIsAdded(false);
    dispatch(setImg(''));
  };

  const popupTitle = pathname === Pathes.TO_BUY ?
    `Добавить в продукты` :
    productIsAdded ?
      'Добавить ещё' :
      'Добавить продукт';

  return (
    <HalfScreenPopup isVisible={isVisible} handleOpen={handlePopupClose}>
      <div className={styles.form}>
        <div className={styles.title}>
          <TextField variant="h1" color="title" >
            {popupTitle}
          </TextField>
        </div>
        <div>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ul className={styles.fieldsList}>
                <li className={styles.fieldItem}>
                  <ControlledTextArea name="title" placeholder="Название" rows={3} maxLength={63} />
                </li>
                <div style={{ display: 'flex', alignItems: 'center', columnGap: '15px' }}>
                  <li className={styles.fieldItem}>
                    <DatePicker name="expiredDate" placeholder="Годен до" disabled />
                  </li>
                  <div className={styles.takePhotoBtn}>
                    <ActionBtn variant="text" action={handleOpened} color={camImg ? 'success' : 'default'} >
                      {
                        camImg && <FaChevronCircleDown className={styles.uploadedIcon} /> ||
                        <FaCameraRetro className={styles.camIcon} />
                      }
                    </ActionBtn>
                  </div>
                </div>
              </ul>
              <GuideBtn />
              <button className={styles.button} type="submit">
                {BTN_TITLE}
              </button>
            </form>
          </FormProvider>
        </div>
      </div>
    </HalfScreenPopup >
  )
};