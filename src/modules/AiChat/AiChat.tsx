/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { SectionWrapper } from "@/components/SectionWrapper";
import { TextField } from "@/components/TextField";
import { getProductsFromIDB } from "@/lib/storage/indexedDb/existingProducts";
import { RootState } from "@/lib/store/store";
import { TProduct } from "@/lib/types/product";
import { detectProductTimeLeft } from "@/utils/detectProductTimeLeft";
import useFetch from "@/utils/hooks.ts/useFetch";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TReceipe } from "@/lib/types/recipe";
import { v4 as uuidv4 } from 'uuid';
import { ReturnBtn } from "@/components/Buttons/ReturnBtn";
import { useRouter } from "next/navigation";
import { Pathes } from "@/lib/types/pathes";
import { SwitchTheme } from "@/components/SwitchTheme";
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import { setAiRequestCount } from "@/lib/store/features/aiRequestsCountSlice";
import moment from "moment";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import styles from './AiChat.module.css';

const parseRecipes = (text: string) => {
  const recipes = [];
  const recipeRegex = /(\d+\.\s+\*\*([^*]+)\*\*)\s+([\s\S]*?)(?=\n\d+\.\s+\*\*|$)/g;

  let match;
  while ((match = recipeRegex.exec(text)) !== null) {
    const titleLine = match[1];
    const title = match[2];
    const description = match[3].trim();

    const steps = description.split(/\n\s*-\s*/).filter(s => s.trim() !== '');

    recipes.push({
      title,
      steps,
    });
  };

  return recipes;
};

export const AiChat = () => {
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const dispatch = useDispatch();

  const router = useRouter();
  const { theme } = useSelector((state: RootState) => state.theme);
  const requestsCount = useSelector((state: RootState) => state.aiRequestCountSlice.aiRequestCount);
  const { fetch: fetchData, data, isLoading } = useFetch<{ message: string }>();

  const [notProductsMsg, setNoProductsMsg] = useState(false);
  const [objectedData, setObjectedData] = useState<TReceipe[]>([]);

  useEffect(() => {
    if (!isUserOnline) {
      router.replace(Pathes.MENU_LIST);
      return;
    };
  }, []);

  const sendMessage = async () => {
    const localData: TProduct[] = await getProductsFromIDB('all');
    const sortedLocalDataTitles = localData.filter(elem => detectProductTimeLeft(elem.expiredDate) !== 'expired')
      .map(item => item.title) || [];

    const deadlineProducts: TProduct[] = await getProductsFromIDB('all');
    const sortedDeadlineProducts = deadlineProducts.filter(elem => detectProductTimeLeft(elem.expiredDate) === 'deadline')
      .map(item => item.title) || [];

    if (sortedLocalDataTitles?.length === 0) {
      setNoProductsMsg(true);
      return;
    };

    const recipeForDeadlinedProducts = `Представь ты лучший в мире шеф-повар. Предложи до 4 блюд, включая подробный рецепт, что приготовить. Обязательно используй продукты: ${sortedDeadlineProducts}. Дополнительно выбери нужные продукты из этого списка: ${sortedLocalDataTitles}. Не смешивай сладкое с соленым, например: пряники с колбасой. Не предлагай рецепты, для которых нужны продукты, которых нет в массивах. Уложись в 2000 символов. Рассчитывай на 4 порции. В конце заверши ответ: Рецепты рассчитаны на 4 порции. Приятного аппетита! Не используй в ответе заголовок ингредиенты и не перечисляй ингредиенты. Начни ответ таким образом: С ингредиентами, которые есть у вас, можно приготовить: `;

    const dto = {
      userId,
      content: recipeForDeadlinedProducts,
    };

    fetchData('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dto }),
    });
  };

  useEffect(() => {
    if (!userId) return;
    sendMessage();
  }, [userId]);

  useEffect(() => {
    if (!data?.message) return;

    dispatch(setAiRequestCount({ count: requestsCount.count + 1, date: moment().format('DD.MM.YYYY') }))

    const markdownTobject = parseRecipes(data.message);
    if (objectedData.length > 0) {
      const compareNoId = objectedData.map(recipe => {
        const { _id, ...rest } = recipe;
        return rest;
      });
      const uniqueValues = compareNoId.filter(elem => !markdownTobject.includes(elem));
      if (uniqueValues?.length <= 0) {
        return;
      };
      const withId = uniqueValues.map(elem => ({ ...elem, _id: uuidv4() }));
      setObjectedData(withId);
      return;
    };
    const objectsWithId = markdownTobject.map(recipe => ({ ...recipe, _id: uuidv4() }));
    setObjectedData(objectsWithId);
  }, [data]);

  const handleReturn = () => {
    router.push(Pathes.MAIN);
  };

  const loading = (
    <FadeComponent isVisible={isLoading && objectedData?.length <= 0}>
      <div className={styles.video}>
        <img
          src={theme === 'dark' ? '/videos/recipeLoadingDarkTheme.gif' : '/videos/recipeLoadingLightTheme.gif'}
          width="250px"
          alt="Загрузка..."
        />
      </div>
    </FadeComponent>
  );

  const showMsg = (
    <PopupNotification
      title="Продуктов нет"
      subTitle="Пожалуйста, добавьте продукты и попробуйте снова"
      btnTitle="Ок"
      action={() => {
        setNoProductsMsg(false);
        router.replace(Pathes.MENU_LIST);
      }}
      isVisible={notProductsMsg}
    />
  );

  return (
    <>
      {showMsg}
      <SectionWrapper>
        {
          !isLoading && (
            <div className={styles.header}>
              <ReturnBtn action={handleReturn} />
              <SwitchTheme hideText />
            </div>
          )
        }
        {loading}
        {
          objectedData?.length === 0 && !isLoading && (
            <TextField variant="h1" color="title" style={{ marginBottom: '15px' }}>
              Продуктов нет
            </TextField>
          )
        }
        {
          objectedData?.length > 0 && (
            <>
              <TextField variant="h1" color="title" style={{ marginBottom: '15px' }}>
                Рецепты по вашим продуктам. Каждый - по 4 порции
              </TextField>
              <TextField variant="h2" color="main" style={{ marginBottom: '25px' }}>
                Сделайте скриншоты рецептов, которые понравились
              </TextField>
            </>
          )
        }
        <div className={styles.wrapper}>
          {
            objectedData?.length > 0 && (
              objectedData.map(elem => (
                <div key={elem.title} className={styles.recipeWrapper}>
                  <TextField color="title" variant="h3" style={{ marginBottom: '10px' }}>
                    {elem.title}
                  </TextField>
                  <TextField color="main" variant="p" style={{ marginBottom: '10px' }}>
                    {elem.steps}
                  </TextField>
                </div>
              ))
            )
          }
        </div>
      </SectionWrapper>
    </>
  );
};