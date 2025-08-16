'use client';

import { SectionWrapper } from "@/components/SectionWrapper"
import { TextField } from "@/components/TextField";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { TariffPlanItem } from "./TariffPlanItem";
import { carouselSettings, tariffePlanes } from "./config";
import { ReturnBtn } from "@/components/Buttons/ReturnBtn";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useEffect, useState } from "react";
import { checkIsAccountExpired } from "@/utils/checkIsAccountExpired";
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import styles from './TariffPlan.module.css';
import './tariff-plan.css';

export const TariffPlan = () => {
  const router = useRouter();
  const { tariff, expired } = useSelector((state: RootState) => state.userSession.userSession) ?? {};
  const userId = useSelector((state: RootState) => state.userSession.userSession?._id);

  const [isReturnBtnVisible, setIsReturnBtnVisible] = useState(false);

  useEffect(() => {
    if (!tariff || !expired) return;

    const isExpired = checkIsAccountExpired(expired);

    console.log('isExpired', isExpired)
    if (isExpired) {
      setIsReturnBtnVisible(false);
    } else {
      setIsReturnBtnVisible(true);
    }
  }, [tariff, expired]);

  const handleRoute = () => {
    router.back();
  };

  const pageTitle = isReturnBtnVisible ? 'Тарифы' : userId ? 'Выберите тариф' : 'Тарифы';

  return (
    <SectionWrapper>
      <div className={styles.wrapper}>
        <FadeComponent isVisible={isReturnBtnVisible}>
          <div className={styles.returnBtn}>
            <ReturnBtn action={handleRoute} />
          </div>
        </FadeComponent>
        <div className={styles.title}>
          <TextField variant="h1" color="title" style={{ marginBottom: '10px' }}>
            {pageTitle}
          </TextField>
          {
            !userId && !tariff && (
              <TextField variant="p" color="main" style={{ textAlign: 'center' }}>
                Первые 2 недели - полный функционал. <br /> Без тарифа.
              </TextField>
            )
          }
        </div>
        <div>
          <Slider {...carouselSettings}>
            {
              tariffePlanes.map(tariff => (
                <div key={tariff.id}>
                  <TariffPlanItem tariff={tariff} />
                </div>
              ))
            }
          </Slider>
        </div>
      </div>
    </SectionWrapper >
  )
};