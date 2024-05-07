import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Send from "./assets/send.svg";
import Modal from "./components/Modal";
import rittyHeroImg from "./assets/rittyHeroImg.png";
import axios from "axios";
import T from "./utils/switchLang";
import { reqChatResponse } from "./api/capsuleRequests";
import ReactGA from "react-ga4";
import ChatBubble from "./components/ChatBubble";
import Header from "./components/Header";

function App() {
  const [msgList, setMsgList] = useState([]);
  const [text, setText] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTxt, setEmailTxt] = useState("");
  const [isChatValid, setIsChatValid] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    // ga initialize
    if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  function sendMyText() {
    const newMessage = {
      id: "user",
      action: "none",
      content: text,
    };
    addTextToMsgList(newMessage);
  }

  function sendMyTextByEnter(e) {
    const newMessage = {
      id: "user",
      action: "none",
      content: text,
    };
    if (e.target.value.includes("\n")) addTextToMsgList(newMessage);
  }
  function addTextToMsgList(newMsg) {
    if (text.length > 50) alert("50자 이내로 작성해주세요.");
    else if (text.includes("종료")) {
      setIsEmailModalOpen(true);
      setText("");
      // 종료, 지금까지 나눴던 대화 백엔드로 보내주기
    } else if (text !== "") {
      setMsgList((prev) => [...prev, newMsg]);
      sendMsgToServer([...msgList, newMsg]);
      setText("");
    } else {
      alert(T.EnterMsg[0]);
      setText("");
      return;
    }
  }

  async function sendMsgToServer(messageList) {
    const loadingMsg = {
      id: "ritty",
      action: "loading",
      content: "",
    };

    // set loading msg
    setMsgList((prev) => [...prev, loadingMsg]);

    setIsChatValid(false);

    // get chat response
    let response = await reqChatResponse(messageList);

    // set new msg
    setMsgList((prev) => [
      ...prev.filter((el) => el.action !== "loading"),
      response.data,
    ]);

    setIsChatValid(true);
  }

  async function sendEmailToServer() {
    if (emailTxt === "") return;
    if (!validateEmail(emailTxt)) {
      alert("이메일 형식에 맞지 않습니다. 다시 입력해 주세요.");
      setEmailTxt("");
      return;
    }
    try {
      const response = await axios.post(`https://sam-meows.com/api/log/email`, {
        email: emailTxt,
      });

      setEmailTxt("");
      setIsEmailModalOpen(true);
    } catch {
      alert("이미 등록된 이메일이거나 이메일 등록에 문제가 발생하였습니다.");
      setEmailTxt("");
    }
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <main className="flex h-[100vh] bg-white w-[100vw]">
      {/* 왼쪽 섹션 */}
      <section className="w-fit pr-[40px] pl-[70px] z-10 bg-white bg-gradient-to-b from-[#FFF8F0] to-[#FFD4CB] justify-center items-center md:flex hidden">
        <img src={rittyHeroImg} width={344} height={189}></img>
      </section>

      {/* 오른쪽 섹션 */}
      <section className="flex flex-col h-full w-full relative z-0">
        <Header />
        <>
          <div
            className="h-full w-full overflow-y-auto p-[25px]"
            ref={scrollRef}
          >
            {ChatBubble({
              sender: "ritty",
              msg: T.GreetingMsg[0],
            })}

            {msgList.length > 0 &&
              msgList.map((msgEl, idx) =>
                ChatBubble({
                  key: idx,
                  sender: msgEl?.id,
                  msg: msgEl?.content,
                  action: msgEl?.action,
                })
              )}
          </div>

          <div className="flex relative justify-between items-center w-full pt-[15px] pb-[10px] px-[25px] shadow-lg shadow-black">
            <motion.div whileTap={{ scale: 0.97 }} className="w-full">
              <textarea
                className="w-full h-[47px] resize-none rounded-[1.875rem] py-[.625rem] pl-[25px] pr-[2rem] border-[#D6D6D6] bg-[#F9F9F9] border-[.0625rem] my-[5px]"
                placeholder={T.InputPlaceholder[0]}
                value={text}
                text={text}
                onChange={(e) => {
                  setText(e.target.value);
                  sendMyTextByEnter(e);
                }}
              />
            </motion.div>

            <button
              id="send"
              className="absolute right-[34px] top-[26px] bg-transparent cursor-pointer border-[none]"
              onClick={sendMyText}
              disabled={!isChatValid}
            >
              <img src={Send} width="34" height="34" />
            </button>
          </div>
        </>
      </section>

      {isEmailModalOpen && (
        <Modal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        ></Modal>
      )}
    </main>
  );
}

export default App;
