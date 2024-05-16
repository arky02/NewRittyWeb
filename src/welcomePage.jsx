import IdleRitty from "./assets/idleRitty.png";
import Button from "./components/Button";
import { useState } from "react";
import Modal from "./components/Modal";

function WelcomePage({ onBtnClick, today }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="bg-[#FFF6F0] h-full md:w-[400px] w-full flex items-center">
      <div className=" h-fit w-full flex flex-col md:gap-[47px] gap-[30px] px-[20px] items-center relative">
        <h5 className="font-semibold text-[#66443C] md:text-[16px] text-[14.5px] md:-mt-[0px] -mt-[15px]">
          {today}
        </h5>
        <img
          src={IdleRitty}
          width={310}
          height={310}
          className="-mt-[20px]"
        ></img>
        <p className="font-bold text-[#66443C] md:text-[19px] text-[18px] text-center">
          반가워냥! 나는 리티다냥 😺
          <br />
          나랑 이야기 하지 않겠냥?
        </p>

        <div className="w-full text-center ">
          <Button
            text="안녕, 리티!"
            style={"md:text-[19px] text-[16px]"}
            height={51}
            onClick={onBtnClick}
          ></Button>
          <button
            className="underline text-[#69534D] text-[13px] mt-[10px]"
            onClick={() => setIsModalOpen(true)}
          >
            기존 정보가 있으신가요?
          </button>
        </div>
        <Modal
          isOpen={isModalOpen}
          type={"isFirst"}
          onClose={() => setIsModalOpen(false)}
        ></Modal>
      </div>
    </section>
  );
}

export default WelcomePage;
