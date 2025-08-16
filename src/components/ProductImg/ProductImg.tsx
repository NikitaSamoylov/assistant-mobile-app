'use client';

import NextImage from 'next/image';

import { NoImage } from '@/components/NoImage';
import { useState } from 'react';
import styles from './ProductImg.module.css';

type ItemProps = {
  img?: string;
  productId?: string;
};

export const ProductImg = ({ img }: ItemProps) => {
  const [wideImg, setWideImg] = useState(false);

  const handleWideImg = () => {
    setWideImg(wideImg => !wideImg);
  };

  return (
    <>
      <div >
        <button
          className={styles.img}
          onClick={handleWideImg}
        >
          {
            img ? (
              <NextImage
                src={img}
                width={59}
                height={59}
                alt={'Продукт'}
                style={{
                  borderRadius: '10px',
                  border: 'none'
                }}
              />
            ) : (
              <NoImage />
            )
          }
        </button>
      </div>
    </>
  )
};