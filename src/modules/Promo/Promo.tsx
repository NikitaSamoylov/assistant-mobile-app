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
  'Продукты-невидимки - то, что вы купили и забыли.',
  'Двойные покупки - когда вы не помните, что уже есть дома.',
  'Тихие убийцы бюджета - просроченные продукты, которые вы выбрасываете.',
];

const list2 = [
  'смартфон или планшет',
  'блендер',
  'хорошие туфли',
];

const list3 = [
  'Автоматически учитывает ВСЕ ваши продукты.',
  'Предупреждает за день до окончания срока.',
  'Подбирает рецепты по истекающим продуктам.',
  'Создает умный список покупок.',
];

const list4 = [
  'Внесите название и срок годности продукта в приложение: на клавиатуре или голосов.',
  'Уведомление: завтра сроки истекают. Вот 4 рецепта.',
  'Перенесите истекающие продукты в список на покупку и отправьте мужу.',
];

export const Promo = () => {
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
          src={'/promo/fridge_img.jpg'}
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
            🔥 Почему ваш холодильник ворует у вас 23,000 рублей в год? (И как остановить это сегодня) 🔥
          </h1>
          {/* <TextField variant="h2" color="main" style={{ marginBottom: '30px', lineHeight: '2.7rem' }}>
            Вам знакомо это чувство?
          </TextField> */}
          {/* =========================================================================================== body  */}
          <Paragraph>
            Вы только что вернулись из магазина. Положили продукты в холодильник. И...
          </Paragraph>
          <PageSubtitle>
            С этого момента начинается воровство.
          </PageSubtitle>
          <Paragraph>
            Каждый день ваш холодильник крадет у вас деньги. Медленно. Безжалостно. Незаметно.
          </Paragraph>
          <Paragraph tillUlSpace>
            Как?
          </Paragraph>
          <List config={list1} icon="uncheck" />
          <Paragraph tillUlSpace>
            Факт: Средняя российская семья выбрасывает продуктов на 23 000 рублей в год. Это:
          </Paragraph>
          <List config={list2} icon="check" />
          <PageSubtitle>
            Но сегодня всё изменится.
          </PageSubtitle>
          <Paragraph tillUlSpace>
            Мой дворецкий - первое приложение, которое:
          </Paragraph>
          <List config={list3} icon="check" />
          <PageSubtitle>
            Как это работает?
          </PageSubtitle>
          <List config={list4} icon="check" />
          <PageSubtitle>
            Специальное предложение:
          </PageSubtitle>
          <Paragraph>
            14 дней - бесплатно. Дальше - подключите тариф или откажитесь. Полный тариф Про для вас будет стоить всего 79 руб. на 30 дней вместо 199.
          </Paragraph>
          <PageSubtitle>
            Каждый день без дворецкого - это 63 рубля, выброшенных в мусорку.
          </PageSubtitle>
          <Paragraph>
            Добавьте приложение на домашний экран и попробуйте все возможности.
          </Paragraph>
          {
            showGifts && (
              <>
                <PageSubtitle >
                  P.S. Получите приложение в течение 2 часов и внутри найдёте 2 бонуса🎁:
                </PageSubtitle>
                <Paragraph >
                  🫶 лайфхаки профессиональных поваров
                </Paragraph>
                <Paragraph >
                  👉 топ ошибок 9/10 хозяек
                </Paragraph>
                <Countdown date={Date.now() + 7200000} renderer={renderer} />
              </>
            )
          }
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