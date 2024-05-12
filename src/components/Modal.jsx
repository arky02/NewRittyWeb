import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import Letter from "../assets/letter.png";
import Button from "./Button";
import Delete from "../assets/deleteIcon.svg";
import GrayDelete from "../assets/grayDeleteIcon.svg";
import { useEffect, useState } from "react";
import { useValidateSession } from "../hooks/useValidateSession";
import {
  reqSaveUserResponse,
  reqUserNameResponse,
} from "../api/capsuleRequests";
import { validateEmail } from "../utils/validation";

// type: isFirst changeInfo setName exit sendEmail
function Modal({
  isOpen = false,
  onClose,
  onOKClick = () => {},
  type = "changeInfo",
}) {
  const [isEmailInfoSaved, setEmailInfoSaved] = useState(false);
  const { saveUserInfo, isEmailSaved, isNameSaved, getEmail, getName } =
    useValidateSession();

  useEffect(() => {
    if (isEmailSaved()) setEmailInfoSaved(true);
  }, []);

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
        {type === "isFirst" && <IsFirstModal></IsFirstModal>}
        {type === "changeInfo" && <ChangeInfoModal></ChangeInfoModal>}
        {type === "setName" && <SetNameModal></SetNameModal>}
        {type === "exit" && <ExitModal></ExitModal>}
        {type === "sendEmail" && <SendEmailModal></SendEmailModal>}
      </div>,
      portalDiv
    )
  ) : (
    <></>
  );

  async function saveUserInfoToServer({ email }) {
    const name = getName();
    let response = await reqSaveUserResponse({ email: email, name: name });

    if (response === null) {
      // 서버 에러거나 중복
      console.log("user not added to server");
      onClose();
      return;
    } else {
      saveUserInfo({ type: "user_email", context: email });
      setEmailInfoSaved(true);
      console.log("user added to server");
    }

    return response;
  }

  function SendEmailModal() {
    const [emailTxt, setEmailTxt] = useState("");

    useEffect(() => {
      if (isEmailInfoSaved) {
        console.log("send chat log to server");
        onOKClick();
      }
    }, []);
    return (
      <div className="z-[100px] fixed left-1/2 top-1/2 z-[100] flex h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-start gap-[28px] rounded-[20px] bg-white shadow-main">
        <div className="bg-gradient-to-r from-[#FF917A] to-[#D76371] w-full rounded-t-2xl -mt-1 py-[27px] flex flex-col justify-center items-center relative">
          <img src={Letter} width={70} height={55} alt="메일" />
          <span className="text-white text-[25px] font-semibold">
            기록 완료
          </span>
          <img
            src={Delete}
            width={15}
            height={15}
            onClick={() => {
              onClose();
            }}
            className="absolute top-0 right-[22px] top-[19px] cursor-pointer"
            alt="닫기"
          ></img>
        </div>

        {isEmailInfoSaved ? (
          <p className="text-[#1A1A1A] w-[300px] text-center">
            리티와의 대화가 종료되었습니다.
            <br /> 오늘의 기록은 메일로 전송됩니다. <br />
            <br />
            “너의 하루에 대해서 이야기해줘서 고맙다냥 🐾 <br />
            내일 아침에 일기를 보내줄게!
            <br /> 좋은 꿈 꿈꿔라냥😽”
            <br />
            {""}
            <br />
            <h5 className="text-[12px] text-[#9B9B9B]">
              이메일 변경을 원할 시, 설정 버튼을 눌러주세요
            </h5>
          </p>
        ) : (
          <p className="text-[#1A1A1A] w-[300px] text-center">
            리티와의 대화가 종료되었습니다. <br />
            오늘의 기록을 받을 메일을 입력해주세요. <br />
            리티가 당신과 함께한 기록을 작성해 <br />
            메일로 보내드립니다!
          </p>
        )}

        {!isEmailInfoSaved && (
          <div className="flex h-[48px] gap-[10px] w-full px-[25px]">
            <motion.div whileTap={{ scale: 0.95 }} className="w-full h-full">
              <input
                className="bg-[#F1F1F1] color-black rounded-[15px] px-[15px] w-full h-full"
                placeholder="이메일을 입력해주세요"
                text={emailTxt}
                value={emailTxt}
                onChange={(e) => setEmailTxt(e.target.value)}
              />
            </motion.div>
            <Button
              onClick={() => {
                if (emailTxt === "") {
                  alert("이메일을 입력 해 주세요.");
                  return;
                }

                if (!validateEmail(emailTxt)) {
                  alert("이메일 형식에 맞지 않습니다. 다시 입력해 주세요.");
                  setEmailTxt("");
                  return;
                }

                saveUserInfoToServer({ email: emailTxt });
                if (isEmailInfoSaved) {
                  onOKClick(); // 서버에 오늘의 채팅 기록 전송
                  console.log("send chat log to server");
                } else {
                  alert(
                    "에러가 발생했습니다. 이메일 등록을 다시 진행 해 주세요!"
                  );
                }
              }}
              text="보내기"
              style={"w-fit"}
            ></Button>
          </div>
        )}
      </div>
    );
  }

  function IsFirstModal() {
    const [emailTxt, setEmailTxt] = useState("");

    const getUserName = async () => {
      const response = await reqUserNameResponse({ email: emailTxt });

      if (response.data.length === 0) {
        // 이름 정보 없음 - 회원 X
        alert("회원 정보가 없습니다!");
      } else {
        const userName = response.data[0].name;
        alert(`안녕하세요 ${userName}님! 😺`);
        saveUserInfo({ type: "user_name", context: userName });
      }
    };
    return (
      <div className="z-[100px] fixed left-1/2 top-1/2 z-[100] flex h-[177px] w-[320px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-start gap-[20px] rounded-[20px] bg-white shadow-main">
        <div className="bg-gradient-to-r from-[#FF917A] to-[#D76371] w-full rounded-t-2xl -mt-1 py-[22px] flex flex-col justify-center items-center relative">
          <img
            src={Delete}
            width={15}
            height={15}
            onClick={onClose}
            className="absolute top-0 right-[20px] top-[15px] cursor-pointer"
            alt="닫기"
          ></img>
        </div>

        <p className="text-[#3D3D3D] w-[300px] text-center font-bold text-[17px]">
          다이어리를 사용한 적이 있으신가요?
        </p>

        <div className="flex h-[48px] gap-[10px] w-full px-[15px]">
          <motion.div whileTap={{ scale: 0.95 }} className="w-full h-full">
            <input
              className="bg-[#F1F1F1] color-black rounded-[15px] px-[15px] w-full h-full"
              placeholder="이메일을 입력해주세요!"
              text={emailTxt}
              value={emailTxt}
              onChange={(e) => setEmailTxt(e.target.value)}
            />
          </motion.div>
          <Button
            onClick={() => {
              if (emailTxt === "") {
                alert("이메일을 입력 해 주세요.");
                return;
              }

              if (!validateEmail(emailTxt)) {
                alert("이메일 형식에 맞지 않습니다. 다시 입력해 주세요.");
                setEmailTxt("");
                return;
              }

              getUserName();
              setTimeout(() => onClose(), 2000);
            }}
            text="확인"
            style={"w-fit"}
          ></Button>
        </div>
      </div>
    );
  }

  function SetNameModal() {
    const [nameTxt, setNameTxt] = useState("");
    return (
      <div className="z-[100px] fixed left-1/2 top-1/2 z-[100] flex h-[225px] w-[320px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-start gap-[15px] rounded-[20px] bg-white shadow-main">
        <div className="relative w-full">
          <img
            src={GrayDelete}
            width={15}
            height={15}
            onClick={onClose}
            className="absolute top-0 right-[20px] top-[18px] cursor-pointer"
            alt="닫기"
          ></img>
        </div>

        <p className="text-[#3D3D3D] w-[300px] text-center font-bold text-[18px] mt-[23px]">
          이름을 정해주세요
        </p>
        <p className="text-[#747474] w-[300px] text-center font-light text-[15px]">
          리티가 사용자를 어떻게 부를지 이름을 결정해요. ex) 길동, 나나, 효린
        </p>

        <div className="flex h-[48px] gap-[10px] w-full px-[15px] mt-[13px]">
          <motion.div whileTap={{ scale: 0.95 }} className="w-full h-full">
            <input
              className="bg-[#F1F1F1] color-black rounded-[15px] px-[15px] w-full h-full"
              placeholder="이름 입력"
              text={nameTxt}
              value={nameTxt}
              onChange={(e) => setNameTxt(e.target.value)}
            />
          </motion.div>
          <Button
            onClick={() => {
              if (nameTxt === "") {
                alert("이름을 입력 해 주세요!");
                return;
              }
              saveUserInfo({ type: "user_name", context: nameTxt });
              onClose();
            }}
            text="결정하기"
            style={"w-fit"}
          ></Button>
        </div>
      </div>
    );
  }

  function ExitModal() {
    return (
      <div className="z-[100px] fixed left-1/2 top-1/2 z-[100] flex h-[210px] w-[320px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-start gap-[15px] rounded-[20px] bg-white shadow-main">
        <div className="relative w-full">
          <img
            src={GrayDelete}
            width={15}
            height={15}
            onClick={onClose}
            className="absolute top-0 right-[20px] top-[18px] cursor-pointer"
            alt="닫기"
          ></img>
        </div>

        <p className="text-[#3D3D3D] w-[300px] text-center font-bold text-[18px] mt-[16px]">
          오늘의 대화를 종료할까요?
        </p>

        <div className="flex flex-col h-[48px] gap-[10px] w-full px-[15px] mt-[13px]">
          <Button
            onClick={() => {
              onClose();
            }}
            text="계속할래요 😽"
            style={"w-full"}
          />
          <Button
            onClick={() => {
              onOKClick();
            }}
            text="종료할래요 😿"
            style={"w-full"}
          />
        </div>
      </div>
    );
  }

  function ChangeInfoModal() {
    return (
      <div className="z-[100px] fixed left-1/2 top-1/2 z-[100] flex h-[482px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-start gap-[23px] rounded-[20px] bg-white shadow-main px-[13px]">
        <section className="flex flex-col gap-[17px] items-center">
          <div className="relative w-full">
            <img
              src={GrayDelete}
              width={15}
              height={15}
              onClick={onClose}
              className="absolute top-0 right-[10px] top-[23px] cursor-pointer"
              alt="닫기"
            ></img>
          </div>

          <p className="text-[#3D3D3D] w-[300px] text-center font-bold text-[18px] mt-[23px]">
            이름 변경
          </p>
          <p className="text-[#747474] w-[300px] text-center font-light text-[15px]">
            리티가 사용자를 어떻게 부를지 이름을 결정해요. ex) 길동, 나나, 효린
          </p>

          <div className="flex h-[48px] gap-[10px] w-full">
            <motion.div whileTap={{ scale: 0.95 }} className="w-full h-full">
              <input
                className="bg-[#F1F1F1] color-black rounded-[15px] px-[15px] w-full h-full"
                placeholder="홍길동"
              />
            </motion.div>
            <Button onClick={() => {}} text="변경하기" style={"w-fit"} />
          </div>
        </section>
        <div className="bg-[#F0F0F0] w-full h-[1px]"></div>
        <section className="flex flex-col gap-[17px] items-center">
          <p className="text-[#3D3D3D] w-[300px] text-center font-bold text-[18px]">
            이메일 변경
          </p>
          <p className="text-[#747474] w-[300px] text-center font-light text-[15px]">
            리티와 한 대화를 바탕으로 일기를 어디로
            <br /> 보내줄지 결정해요.
          </p>

          <div className="flex h-[48px] gap-[10px] w-full">
            <motion.div whileTap={{ scale: 0.95 }} className="w-full h-full">
              <input
                className="bg-[#F1F1F1] color-black rounded-[15px] px-[15px] w-full h-full"
                placeholder="example@gmail.com"
              />
            </motion.div>
            <Button onClick={() => {}} text="변경하기" style={"w-fit"} />
          </div>
        </section>
        <Button
          onClick={() => {
            onClose();
          }}
          text="완료했어요!"
          style={"w-full"}
        />
      </div>
    );
  }
}

export default Modal;
