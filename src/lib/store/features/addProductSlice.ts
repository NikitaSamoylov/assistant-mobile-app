import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  addProduct: {
    img: string;
    title: string;
    expired: string;
    isPopupOpened: boolean;
  };
};

const initialState: IState = {
  addProduct: {
    img: '',
    title: '',
    expired: '',
    isPopupOpened: false,
  },
};

const addProductSlice = createSlice({
  name: 'addProductSlice',
  initialState,
  reducers: {
    setIsPopupOpened: (state, action: PayloadAction<boolean>) => {
      state.addProduct.isPopupOpened = action.payload;
    },
    setImg: (state, action: PayloadAction<string>) => {
      state.addProduct.img = action.payload;
    },
    setText: (state, action: PayloadAction<{ title: string; expired: string }>) => {
      state.addProduct.title = action.payload.title;
      state.addProduct.expired = action.payload.expired;
    },
  },
});

export const { setIsPopupOpened, setImg, setText } = addProductSlice.actions;
export default addProductSlice.reducer;