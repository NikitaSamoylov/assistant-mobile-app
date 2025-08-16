export const popupVariants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 0.3,
    },
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: {
      type: 'spring',
      duration: 0.3,
    },
  },
};