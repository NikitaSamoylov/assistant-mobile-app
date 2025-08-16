export enum TariffesTitles {
  BASE_TARIFF = 'базовый',
  PRO_TARIFF = 'ПРО',
  FREEMIUM = 'фримиум',
};

type TTariffesList = string;

export type TTarifes = {
  id: number;
  title: string;
  price: number;
  items: TTariffesList[];
};