import RittyImg from "../assets/rittyImg.png";

function ChatBubble({ sender, msg, action }) {
  console.log(action);
  return sender === "user" ? (
    <div className="inline-block w-fit text-sm relative mx-0 my-[20px] bg-[#FF917A] float-right clear-both text-white py-[8px] px-[13px] rounded-[.875rem_.875rem_0_.875rem]">
      {msg}
    </div>
  ) : (
    <div className="flex w-fit items-end w-full">
      <img
        src={RittyImg}
        width={35}
        height={35}
        className="bg-contain h-[35px] mr-[10px] mb-[13px]"
      ></img>
      <div className="inline-block w-fit text-sm relative mx-0 my-[15px] bg-[#EDEDED] float-left clear-both text-[#000000] py-[8px] px-[13px] rounded-[.875rem_.875rem_.875rem_0]">
        {action === "loading" ? (
          <div className="flex space-x-1 justify-center items-center  p-[7.2px] ">
            <div className="h-[6px] w-[6px] bg-[#919191] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-[6px] w-[6px] bg-[#919191] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-[6px] w-[6px] bg-[#919191] rounded-full animate-bounce"></div>
          </div>
        ) : (
          msg
        )}
      </div>
    </div>
  );
}

export default ChatBubble;
