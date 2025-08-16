import imageCompression from 'browser-image-compression';

export const compressImageOptions = {
  maxSizeMB: 0.4,
  maxWidthOrHeight: 300,
  useWebWorker: true,
};

// Функция для преобразования Blob URL в файл
export async function convertBlobUrlToFile(blobUrl: string) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const fileName = Math.random().toString(36).slice(2, 9);
  const mimeType = blob.type || "application/octet-stream";
  const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`, {
    type: mimeType,
  });
  return file;
}

// Функция для преобразования Blob в Base64
function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Обрезка изображения до квадрата через Canvas
async function cropToSquare(imageBlob: Blob, size = 90): Promise<Blob> {
  const img = await createImageBitmap(imageBlob);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Вычисляем, какую часть изображения нужно обрезать
  const minSide = Math.min(img.width, img.height);
  const sx = (img.width - minSide) / 2;
  const sy = (img.height - minSide) / 2;

  ctx?.drawImage(
    img,
    sx,
    sy,
    minSide,
    minSide,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/jpeg');
  });
}

// Основная функция: обрезка, сжатие и конвертация
export const convertAndCompresse = async (base64: string) => {
  if (base64) {
    // Получение файла из Base64
    const response = await fetch(base64);
    const blob = await response.blob();

    // Обрезка изображения до квадрата
    const squareBlob = await cropToSquare(blob, 90);

    // Конвертация в файл для сжатия
    const fileName = Math.random().toString(36).slice(2, 9);
    const file = new File([squareBlob], `${fileName}.jpg`, { type: 'image/jpeg' });

    // Сжатие изображения
    const compressedFile = await imageCompression(file, compressImageOptions);

    // Конвертация обратно в Base64
    const converted = await blobToBase64(compressedFile) as string;
    return converted;
  }
  return base64;
};

