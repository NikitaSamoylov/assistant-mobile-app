import { TariffesTitles } from "@/lib/types/tariffes";

export const tariffePlanes = [
  {
    id: 0,
    title: TariffesTitles.BASE_TARIFF,
    price: 49,
    items: [
      'уведомления о сроках годности',
      'до 80 продуктов в списке на покупку',
      'до 140 продуктов - в купленных',
      'без создания резевной копии',
      'без подбора рецептов по продуктам',
      'без выбора темы приложения',
    ],
  },
  {
    id: 1,
    title: TariffesTitles.PRO_TARIFF,
    price: 79,
    items: [
      'уведомления о сроках годности',
      'до 80 продуктов в списке на покупку',
      'до 140 продуктов - в купленных',
      'создание резевной копии',
      'подбор рецептов по продуктам',
      'выбор светлой или темной темы',
    ],
  },
];

export const carouselSettings = {
  dots: true,
  arrows: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
