/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import Webcam from "react-webcam";
import { useRef, useState } from 'react';
import { Spinner } from "@/components/Spinner.tsx";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { PRELOADER_DEFAULT_SIZE } from "@/lib/consts/consts";
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import { ReturnBtn } from "@/components/Buttons/ReturnBtn";
import { CamActionBtn } from "./CamActionBtn";
import { MdCameraAlt } from "react-icons/md";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { PiCheckCircleBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { setImg } from "@/lib/store/features/addProductSlice";
import classNames from "classnames";
import { RootState } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { Pathes } from "@/lib/types/pathes";
import styles from './WebCamModule.module.css';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
};

const videoConstraints = {
  // facingMode: 'user',
  facingMode: { exact: "environment" },
  width: { ideal: 1280 },
  height: { ideal: 720 },
};

export const WebCamModule = () => {
  const webcamData = useSelector((state: RootState) => state.addProduct.addProduct);

  const router = useRouter();

  const webcamRef = useRef<Webcam>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch();

  const handleUserMedia = () => {
    setIsStreaming(prev => !prev);
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot() || null;
    if (!imageSrc) return;

    dispatch(setImg(imageSrc));
  };

  const retake = async () => {
    handleUserMedia();
    dispatch(setImg(''));
    if (!isStreaming) {
      handleUserMedia();
    };
  };

  console.log('isStreaming', isStreaming)

  const handleDesctructure = () => {
    handleUserMedia();
    dispatch(setImg(''));
    router.replace(Pathes.MAIN);
  };

  const handleClose = () => {
    router.replace(Pathes.MAIN);
  };

  const handleUserMediaError = (error: unknown) => {
    console.error('Error accessing media devices.', error);
    setIsError(true);
    setIsStreaming(false);
  };

  const isLoading = !isStreaming && !webcamData?.img && !isError && (
    <div className={styles.spinner}>
      <Spinner size={PRELOADER_DEFAULT_SIZE} color="default" />
    </div>
  );

  const renderContent = () => {
    if (webcamData?.img) {
      return (
        <>
          <div className={styles.camWrapper}>
            {
              !isLoading && (
                <div className={styles.returnBtn}>
                  <ReturnBtn action={handleDesctructure} />
                </div>
              )
            }
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={webcamData?.img}
                alt="фото с камеры"
                className={styles.cam}
              />
            </div>
          </div>
        </>
      );
    };

    return (
      <>
        <div className={styles.camWrapper}>
          {
            !isLoading && (
              <div className={styles.returnBtn}>
                <ReturnBtn action={handleDesctructure} />
              </div>
            )
          }
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Webcam
              audio={false}
              imageSmoothing={true}
              ref={webcamRef}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              screenshotQuality={1}
              className={styles.cam}
            />
          </div>
        </div>
      </>
    );
  };

  const showError = (
    <PopupNotification
      title="Ошибка доступа к камере"
      subTitle="Проверьте настройки"
      btnTitle="Ок"
      action={() => {
        handleClose();
      }}
      isVisible={!!isError}
    />
  )

  return (
    <FadeComponent isVisible={true}>
      <article className={styles.popupFullScreen}>
        {isLoading}
        {renderContent()}
        {showError}
        {isStreaming && (
          <div style={{ marginTop: "10px" }}>
            {!webcamData?.img && (
              <div className={styles.actionBtnWrapper}>
                <CamActionBtn action={capture}>
                  <MdCameraAlt className={styles.actionBtnIcon} />
                </CamActionBtn>
              </div>
            )}
          </div>
        )}
        {
          webcamData?.img && (
            <div className={styles.actionBtnWrapper}>
              <CamActionBtn action={retake}>
                <FaArrowRotateLeft className={styles.actionBtnIcon} />
              </CamActionBtn>
              <CamActionBtn action={() => { router.replace(Pathes.MAIN) }}>
                <PiCheckCircleBold className={classNames(styles.actionBtnIcon, styles.acceptPhoto)} />
              </CamActionBtn>
            </div>
          )
        }
      </article>
    </FadeComponent>
  );
};