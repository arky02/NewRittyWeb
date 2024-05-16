import RittyImg from "../assets/rittyImg.png";
import checkIcon from "../assets/checkIcon.svg";
import settingIcon from "../assets/settingIcon.svg";
import Modal from "./Modal";
import { useValidateSession } from "../hooks/useValidateSession";
import { useState } from "react";

function Header({ modalState, setModalState }) {
  return (
    <div className="bg-[#FFF6F0] w-full md:w-[400px] h-fit border-b-[1px] px-[15px] md:py-[15px] py-[11px] flex md:relative items-center gap-[15px] font-bold justify-between fixed top-0">
      <section className="flex gap-[15px]">
        <img src={RittyImg} width={41} height={41} alt="리티 프로필" />
        <div>
          <h1 className="md:text-[19px] text-[17px] -mb-[5px]">리티</h1>
          <h3 className="text-[#979797] text-[12px] -mt-1">ritty</h3>
        </div>
      </section>
      <section className="flex gap-[12px]">
        <button onClick={() => setModalState("exit")}>
          <img src={checkIcon} width={32} height={32} alt="check"></img>
        </button>
        <button onClick={() => setModalState("changeInfo")}>
          <img src={settingIcon} width={27} height={27} alt="setting"></img>
        </button>
      </section>
      {
        <Modal
          type={modalState}
          isOpen={modalState ? true : false}
          onClose={() => setModalState(null)}
        ></Modal>
      }
    </div>
  );
}

export default Header;
