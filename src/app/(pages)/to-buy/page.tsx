'use client';

import { RootState } from "@/lib/store/store";
import { ProductsBuyContent } from "@/modules/ProductsBuyContent";
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import { SearchToBuy } from "@/modules/SearchToBuy";

const searchVariants = {
  initial: { y: 0, opacity: 1 },
  moveUp: { y: -55, opacity: 1, transition: { duration: 0.3 } },
  moveDown: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const ToBuyPage = () => {
  const { isSearchToBuy } = useSelector((state: RootState) => state.isSearchToBuy);

  return (
    <div>
      <motion.div
        initial="moveDown"
        animate={isSearchToBuy ? "moveUp" : "moveDown"}
        variants={searchVariants}
      >
        <SearchToBuy />
      </motion.div>
      <FadeComponent isVisible={!isSearchToBuy}>
        <ProductsBuyContent />
      </FadeComponent>
    </div>
  )
};

export default ToBuyPage;