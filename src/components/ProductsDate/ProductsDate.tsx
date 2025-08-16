'use client';

import { TextField } from "@/components/TextField";
import moment from "moment";

type TProductsDataProps = {
  dateString?: string;
  tillTo?: boolean;
  mode?: 'created' | 'updated';
};

export const ProductsDate = ({ dateString, tillTo = false, mode }: TProductsDataProps) => {
  if (!dateString) return;

  const date1 = moment(dateString, 'DD.MM.YYYY').startOf('day'); // дата из строки
  const today = moment().startOf('day'); // начало сегодняшнего дня

  if (tillTo) {
    if (today.isBefore(date1)) {
      const daysDiff = date1.diff(today, 'days');
      if (daysDiff == 2) {
        return <TextField variant="span" color="main">до послезавтра</TextField>;
      };
      if (daysDiff == 3) {
        return <TextField variant="span" color="main">ещё 2 дня</TextField>;
      };
      if (daysDiff == 4) {
        return <TextField variant="span" color="main">ещё 3 дня</TextField>;
      };
      // дата еще не прошла
      return <TextField variant="span" color="main">до {date1.format('DD.MM.YYYY')}</TextField>;
    } else {
      // дата прошла
      return <TextField variant="span" color="main">Срок истёк {date1.format('DD.MM.YYYY')}</TextField>;
    }
  } else {
    const daysDiff = date1.diff(today, 'days');
    const content = mode === 'updated' ? 'Обновлено' : 'Добавлено';

    if (daysDiff === 0) {
      return (
        <TextField variant="p" color="caption">{content} сегодня</TextField>
      )
    } else if (daysDiff === -1) {
      return (
        <TextField variant="p" color="caption">{content} вчера</TextField>
      )
    } else {
      return (
        <TextField variant="p" color="caption">{content} {date1.format('DD.MM.YY')}</TextField>
      )
    };
  };
};