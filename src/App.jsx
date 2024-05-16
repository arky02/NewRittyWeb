import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Send from "./assets/send.svg";
import Modal from "./components/Modal";
import rittyHeroImg from "./assets/rittyHeroImg.png";
import T from "./utils/switchLang";
import { reqChatResponse, reqChatEndResponse } from "./api/capsuleRequests";
import ReactGA from "react-ga4";
import ChatBubble from "./components/ChatBubble";
import Header from "./components/Header";
import WelcomePage from "./welcomePage";
import { useValidateSession } from "./hooks/useValidateSession";

function App() {
  const initialMsg = {
    id: "ritty",
    content: T.GreetingMsg[0],
  };
  const [msgList, setMsgList] = useState([initialMsg]);
  const [text, setText] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(true);
  const [isChatValid, setIsChatValid] = useState(true);
  const [pageIdx, setPageIdx] = useState(0);
  const [modalState, setModalState] = useState(null);
  const scrollRef = useRef();
  const [today, setToday] = useState();
  const { saveUserInfo, isEmailSaved, isNameSaved, getEmail } =
    useValidateSession();

  useEffect(() => {
    if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
      // GA initialize
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
    }

    if (!pageIdx && isEmailSaved() && isNameSaved()) {
      setPageIdx(1);
    }

    const dayList = ["일", "월", "화", "수", "목", "금", "토"];

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const dayOfWeek = today.getDay();
    const currentDate =
      year + "년 " + month + "월 " + date + "일 " + dayList[dayOfWeek] + "요일";
    setToday(currentDate);
  }, []);

  useEffect(() => {
    if (!isNameSaved() && pageIdx === 1) setModalState("setName");
  }, [pageIdx]);

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
      content: text,
    };
    addTextToMsgList(newMessage);
  }

  function sendMyTextByEnter(e) {
    const newMessage = {
      id: "user",
      content: text,
    };
    if (e.target.value.includes("\n")) addTextToMsgList(newMessage);
  }
  function addTextToMsgList(newMsg) {
    if (text.length > 150) alert("150자 이내로 작성해주세요.");
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
      content: "ritty_loading_msg",
    };

    // set loading msg
    setMsgList((prev) => [...prev, loadingMsg]);

    setIsChatValid(false);

    // get chat response
    let response = await reqChatResponse(messageList);

    // set new msg
    setMsgList((prev) => [
      ...prev.filter((el) => el.content !== "ritty_loading_msg"),
      response.data,
    ]);

    setIsChatValid(true);
  }

  return (
    <main className="flex h-[100vh] bg-white w-[100vw]">
      {/* 웹 왼쪽 섹션 */}
      <section className="w-full pr-[40px] pl-[70px] z-10 bg-white bg-gradient-to-b from-[#FFF8F0] to-[#FFD4CB] justify-center items-center md:flex hidden">
        <img src={rittyHeroImg} width={344} height={189}></img>
      </section>

      {/* 모바일 섹션 */}
      <section className="flex flex-col h-full w-full md:w-[400px] relative z-0 ">
        {!pageIdx ? (
          <WelcomePage onBtnClick={() => setPageIdx(1)} today={today} />
        ) : (
          <>
            <Header modalState={modalState} setModalState={setModalState} />
            <>
              <div
                className="h-full w-full overflow-y-auto p-[18px] md:mt-0 mt-[64px] md:mb-0 mb-[77px]"
                ref={scrollRef}
              >
                <h5 className="w-full text-center text-[#A6A6A6] md:text-[13px] text-[11px] -mt-1 mb-3">
                  {today}
                </h5>

                {msgList.length > 0 &&
                  msgList.map((msgEl, idx) =>
                    ChatBubble({
                      key: idx,
                      sender: msgEl?.id,
                      msg: msgEl?.content,
                    })
                  )}
              </div>

              <div className="md:flex md:relative justify-between items-center w-full  pb-[20px] md:pb-[30px] py-[10px] px-[15px] shadow-lg shadow-black absolute bottom-0 bg-white">
                <motion.div whileTap={{ scale: 0.97 }} className="w-full">
                  <textarea
                    className="w-full md:h-[47px] h-[45px] resize-none rounded-[1.875rem] py-[.625rem] pl-[25px] pr-[2rem] border-[#D6D6D6] bg-[#F9F9F9] border-[.0625rem] my-[5px] text-[14px] md:text-[16px] flex items-center"
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
                  className="absolute right-[24px] md:top-[22px] top-[20px] bg-transparent cursor-pointer border-[none]"
                  onClick={sendMyText}
                  disabled={!isChatValid}
                >
                  <img src={Send} width="34" height="34" />
                </button>
              </div>
            </>
          </>
        )}
      </section>

      {/* 웹 오른쪽 섹션 */}
      <section className="lg:w-[400px] w-[100px] lg:p-[150px]  z-10 bg-white bg-gradient-to-b from-[#FFF8F0] to-[#FFD4CB] justify-center items-center md:flex hidden"></section>

      {modalState && (
        <Modal
          type={modalState}
          isOpen={isEmailModalOpen}
          onClose={() => setModalState(null)}
          onOKClick={() => {
            if (modalState === "exit") {
              setModalState("sendEmail");
            }
            if (modalState === "sendEmail") {
              const emailTxt = getEmail();
              reqChatEndResponse({ email: emailTxt, messageList: msgList });
            }
          }}
        ></Modal>
      )}
    </main>
  );
}

export default App;
