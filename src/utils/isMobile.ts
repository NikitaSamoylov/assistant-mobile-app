export const isMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /android|avantgo|blackberry|iemobile|ipad|iphone|ipod|kindle|opera mini|webos|windows phone/i.test(userAgent);
};