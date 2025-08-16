import webpush from 'web-push';

const generateVAPIDKeys = () => {
  const vapidKeys = webpush.generateVAPIDKeys();
  console.log('Public Key:', vapidKeys.publicKey);
  console.log('Private Key:', vapidKeys.privateKey);
};

generateVAPIDKeys();