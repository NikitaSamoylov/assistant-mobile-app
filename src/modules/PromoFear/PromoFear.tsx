/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import NextImage from 'next/image';
import { SectionWrapper } from "@/components/SectionWrapper";
import { TextField } from '@/components/TextField';
import { useEffect, useState } from 'react';
import { List } from './List';
import { PageSubtitle } from './PageSubtitle';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { InstallAppBtn } from '@/components/InstallAppBtn';
import classNames from 'classnames';
import { isMobile } from '@/utils/isMobile';
import { Paragraph } from './Paragraph';
import Countdown from 'react-countdown';
import styles from './Promo.module.css';

const list1 = [
  'Уведомления о сроках годности.',
  'Планировщик покупок.',
  'Подбор рецептов по продуктам, сроки годности которых истекают.',
];

const list2 = [
  'Защищает здоровье вашей семьи 24/7.',
  'Экономит нервы и время на ревизию продуктов.',
  'Экономит бюджет от 1,500 до 3,000 руб. в месяц на просроченных продуктах и дублирующих покупках.',
];

export const PromoFear = () => {
  const [showQr, setShowQr] = useState(false);
  const [showGifts, setShowGifts] = useState(true);

  const renderer = ({ hours, minutes, seconds, completed }: { hours: number, minutes: number, seconds: number, completed: boolean }) => {
    if (completed) {
      setShowGifts(false);
      return null;
    };

    return (
      <TextField variant="h3" color="error" style={{ textAlign: 'center', marginBottom: '15px' }}>
        {hours}:{minutes.toString().padStart(2, '')}:{seconds.toString().padStart(2, '')}
      </TextField>
    )
  };

  useEffect(() => {
    document.body.style.setProperty('--max-width', '780px', 'important');
    return () => {
      document.body.style.setProperty('--max-width', '430px');
    };
  }, []);

  useEffect(() => {
    if (isMobile()) {
      return setShowQr(false);
    };
    setShowQr(true);
  }, []);

  return (
    <SectionWrapper>
      <>
        <NextImage
          src={'/promo/fear.png'}
          width={295}
          height={256}
          alt='Женщина готовит'
          className={styles.mainImg}
        />
        <div className={styles.section}>
          {/* =========================================================================================== headers & subheader  */}
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 700,
              lineHeight: '3.4rem',
              marginBottom: '20px',
              color: '#654321',
            }}
          >
            Представьте: ваш малыш держится за животик, страдая от просроченного йогурта, который вы так и не выбросили...
          </h1>
          {/* =========================================================================================== body  */}
          <Paragraph>
            Вы не раз видели, как крошка мучается от боли? Или часами сидели рядом, чувствуя себя беспомощно?
          </Paragraph>
          <PageSubtitle>
            Стоп!
          </PageSubtitle>
          <Paragraph>
            Хватит переживаний! Время взять всё под контроль.
          </Paragraph>
          <Paragraph>
            Каждый день тысячи родителей по всему миру переживают эти ужасные моменты. И знаете что?
          </Paragraph>
          <PageSubtitle>
            Это можно предотвратить!
          </PageSubtitle>
          <Paragraph>
            Представьте: вы спокойно спите ночью, зная, что все продукты в вашем холодильнике абсолютно безопасны.
            У вас всё под контролем.
          </Paragraph>
          <PageSubtitle>
            ✨ Наше революционное приложение — это ваш персональный страж безопасности питания✨:
          </PageSubtitle>
          <List config={list1} icon="check" />
          <PageSubtitle>
            Это ещё не всё!
          </PageSubtitle>
          <PageSubtitle>
            Наше приложение не просто отслеживает сроки — оно:
          </PageSubtitle>
          <List config={list2} icon="check" />
          <PageSubtitle>
            🎯 Специальное предложение только сейчас!
          </PageSubtitle>
          <Paragraph tillUlSpace>
            Установите приложение в течение 2-х часов и получите:
          </Paragraph>
          <Paragraph>
            бесплатный период на 14 дней!
          </Paragraph>
          <Paragraph>
            Дальше - цена всего 79 рублей на 30 дней вместо 199!
          </Paragraph>
          <Paragraph>
            Не рискуйте здоровьем своих близких!
            Нажмите кнопку «Попробовать» прямо сейчас!
          </Paragraph>
          <Paragraph>
            Уже 2,600 родителей наняли себе помощника. Попробуйте и вы.
          </Paragraph>
          <PageSubtitle>
            P.S. Одна минута бездействия — и здоровье вашей семьи может оказаться под угрозой.
          </PageSubtitle>
          <Countdown date={Date.now() + 7200000} renderer={renderer} />
          <FadeComponent isVisible={showQr}>
            <div className={styles.qrWrapper}>
              <Paragraph>
                📱 Наведите камеру смартфона и сканируйте qr-код. Вы перейдете в мобильный браузер, там будет кнопка для установки
              </Paragraph>
              <NextImage
                src={'/promo/qr-code.png'}
                width={150}
                height={150}
                alt="qr-код"
                className={styles.qrImg}
              />
            </div>
          </FadeComponent>
          <FadeComponent isVisible={!showQr}>
            <InstallAppBtn isInstall={false} />
          </FadeComponent>
        </div>
      </>
      <div className={classNames(isMobile() ? styles.policyInfoMobile : styles.policyInfoDesktop)}>
        <TextField
          variant="span"
          color="caption"
          style={{
            fontSize: isMobile() ? '1rem' : '1.4rem',
            textAlign: 'center'
          }}
        >
          ИП Самойлов Никита Викторович, ИНН 563301125949
        </TextField>
      </div>
    </SectionWrapper >
  )
};