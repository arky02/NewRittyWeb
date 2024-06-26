import { motion } from "framer-motion";

function Button({ onClick, text = "확인", fontSize, height, style }) {
  return (
    <motion.div whileTap={{ scale: 0.85 }} className={`${style}`}>
      <button
        className={`w-full h-full py-[10px] px-[15px] text-white  text-[14px] md:text-[16px] rounded-[15px] font-bold bg-gradient-to-r from-[#FF917A] to-[#e6697b] whitespace-nowrap ${style}`}
        style={{
          height: height ? height : "100%",
        }}
        onClick={onClick}
      >
        {text}
      </button>
    </motion.div>
  );
}

export default Button;
