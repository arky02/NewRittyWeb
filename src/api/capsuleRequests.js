import axios from "axios";

export const reqChatResponse = async (messageList) => {
  let response = "";
  try {
    response = await axios.post(`http://diaryapi.sam-meows.com/api/chat`, {
      message: messageList.filter((el) => el.action !== "loading"),
    });
  } catch {
    alert("서버 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
    return;
  }
  return response;
};

export const reqChatEndResponse = async ({ email, messageList }) => {
  let response = "";
  try {
    response = await axios.post(`http://diaryapi.sam-meows.com/api/save/chat`, {
      email: email,
      chat: messageList.filter((el) => el.action !== "loading"),
    });
  } catch {
    alert("서버 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
    return;
  }
  return response;
};

export const reqSaveUserResponse = async ({ email, name }) => {
  let response = "";
  try {
    response = await axios.post(`http://diaryapi.sam-meows.com/api/save/user`, {
      email: email,
      name: name,
    });
  } catch {
    alert("이미 등록된 이메일이거나 이메일 등록에 문제가 발생하였습니다.");
    return null;
  }
  return response;
};

export const reqUserNameResponse = async ({ email }) => {
  let response = "";
  try {
    response = await axios.get(
      `http://diaryapi.sam-meows.com/api/getname?email=${email}`
    );
  } catch {
    alert("서버 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.");
    return;
  }
  return response;
};
