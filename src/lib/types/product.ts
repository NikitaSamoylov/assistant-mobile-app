export type TProductResp = {
  data: TProduct[];
  isLast: boolean;
};

export type TProduct = {
  _id?: string;
  title: string;
  img?: string;
  createdAt?: string;
  updatedAt?: string;
  expiredDate: string;
  isSent?: boolean | undefined;
};

export type TStateProductsProps = {
  isFresh: TProduct[];
  isDeadline: TProduct[];
  isExpired: TProduct[];
};

export type TBuyProducts = {
  _id: string;
  title: string;
  addedAt: string;
  isBought: boolean,
  isSent?: boolean;
};

export type TBuyProductsResp = {
  data: TBuyProducts[];
  isLast: boolean;
};

export type TUpdateExistingProduct = {
  userId: string | undefined;
  updatedProduct: TProduct[];
  isSent?: boolean;
};