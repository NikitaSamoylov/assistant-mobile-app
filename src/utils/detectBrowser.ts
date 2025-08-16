export const detectBrowser = () => {
  const userAgent = navigator.userAgent;

  if (/YaBrowser/.test(userAgent)) {
    return 'Yandex Browser';
  } else if (/Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor)) {
    return 'Chrome';
  } else if (/Firefox/.test(userAgent)) {
    return 'Firefox';
  } else if (/Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor)) {
    return 'Safari';
  } else if (/Edge/.test(userAgent)) {
    return 'Edge';
  } else if (/MSIE|Trident/.test(userAgent)) {
    return 'Internet Explorer';
  } else {
    return 'Other';
  };
};