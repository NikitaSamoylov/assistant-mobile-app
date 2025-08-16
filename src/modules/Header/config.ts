export const headerVariants = {
  initial: { y: 0, opacity: 1 },
  hide: { y: -100, opacity: 0, transition: { duration: 0.3 } },
  show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

export const searchVariants = {
  initial: { y: 0, opacity: 1 },
  moveUp: { y: -55, opacity: 1, transition: { duration: 0.3 } },
  moveDown: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

