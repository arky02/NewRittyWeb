import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import Letter from "../assets/letter.png";

function Modal({
  isOpen = false,
  title,
  description,
  buttonText = "확인",
  onClose,
}) {
  if (typeof document === "undefined") return;
  const portalDiv = document.querySelector("#modal");

  if (!portalDiv) return null;

  return isOpen ? (
    ReactDOM.createPortal(
      <div>
        <div
          className="fixed left-0 top-0 z-10 size-full bg-[rgba(0,0,0,0.2)]"
          onClick={onClose}
        ></div>
        <div className="z-[100px] fixed left-1/2 top-1/2 z-[100] flex h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-start gap-[32px] rounded-2xl bg-white shadow-main">
          <div className="bg-gradient-to-r from-[#FF917A] to-[#D76371] w-full rounded-t-2xl -mt-1 py-[27px] flex flex-col justify-center items-center">
            <img src={Letter} width={70} height={55}></img>
            <span className="text-white text-[25px] font-semibold">
              기록 완료
            </span>
          </div>

          <p className="text-[#898989] w-[260px] text-center">
            리티와의 대화가 종료되었습니다. <br />
            오늘의 기록을 받을 메일을 입력해주세요. <br />
            리티가 당신과 함께한 기록을 작성해 <br />
            메일로 보내드립니다!
          </p>

          <div className="flex h-[48px] gap-[10px] w-full px-[25px]">
            <motion.div whileTap={{ scale: 0.95 }} className="w-full h-full">
              <input
                className="bg-[#F1F1F1] color-black rounded-[15px] px-[15px] w-full h-full"
                placeholder="이메일을 입력해주세요"
              />
            </motion.div>
            <motion.div whileTap={{ scale: 0.85 }}>
              <button
                className={`w-fit h-full py-[10px] px-[15px] text-white rounded-[15px] font-bold bg-gradient-to-r from-[#FF917A] to-[#D76371] whitespace-nowrap`}
                onClick={onClose}
              >
                보내기
              </button>
            </motion.div>
          </div>
        </div>
      </div>,
      portalDiv
    )
  ) : (
    <></>
  );
}

export default Modal;
