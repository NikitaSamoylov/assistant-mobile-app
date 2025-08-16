import { TBuyProducts, TProduct } from "./product";

export type TBackup = {
  message: {
    backup: {
      existingProducts: TProduct[];
      toBuyProducts: TBuyProducts[];
    };
    createdAt: string;
    updatedAt: string;
    userId: string;
    __v: number;
    _id: string;
  };
};