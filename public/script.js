const board = document.querySelector("#game-board");
const h2 = document.querySelector("h2");
const goodAnswersSpan = document.querySelector("#good-answers");
const buttons = document.querySelectorAll(".btn");
const buttonHelpFriend = document.querySelector("#helpFriend");
const buttonHelpHalf = document.querySelector("#helpHalf");
const buttonHelpCrowd = document.querySelector("#helpCrowd");
const tip = document.querySelector("#tip");

const fillQuestionElements = (data) => {
  if (data.winner) {
    board.style.display = "none";
    h2.innerText = "Congratulations you WON !!!";
    return;
  } else if (data.looser) {
    board.style.display = "none";
    h2.innerText = "I'm so sorry. You lost :(";
    return;
  }

  const question = document.querySelector("#question");
  question.innerText = data.question;
  for (const i in data.answers) {
    const btn = document.querySelector(`#answer${1 * i + 1}`);
    btn.innerHTML = data.answers[i];
  }
};

const showNextQuestion = () => {
  fetch("/question", { method: "GET" })
    .then((res) => res.json())
    .then((data) => fillQuestionElements(data));
};

const handleAnswerFeedback = (data) => {
  goodAnswersSpan.innerText = data.goodAnswer;
  showNextQuestion();
};

const sendAnswer = (id) => {
  fetch(`/answer/${id}`, { method: "POST" })
    .then((res) => res.json())
    .then((data) => handleAnswerFeedback(data));
};

for (const button of buttons) {
  button.addEventListener("click", (e) => {
    const indexAnswer = e.target.dataset.answer;
    sendAnswer(indexAnswer);
  });
}

const handleShowTip = (data) => {
  tip.innerText = data.text;
};

const helpFriend = () => {
  fetch("/help/friend")
    .then((res) => res.json())
    .then((data) => handleShowTip(data));
};
buttonHelpFriend.addEventListener("click", helpFriend);

const handleHelpHalf = (data) => {
  for (const button of buttons) {
    //data.answersToRemove ->[ 'C++', 'Java' ]
    if (data.answersToRemove.indexOf(button.innerText) > -1) {
      button.style.display = "none";
    }
  }
};

const helpHalf = () => {
  fetch("/help/half")
    .then((res) => res.json())
    .then((data) => handleHelpHalf(data));
};

buttonHelpHalf.addEventListener("click", helpHalf);

const handleHelpCrowd = (data) => {
  data.voiceOfCrowd.forEach((value, index) => {
    buttons[index].innerText += `: ${value}%`;
  });
};

const helpCrowd = () => {
  fetch("/help/crowd")
    .then((res) => res.json())
    .then((data) => handleHelpCrowd(data));
};

buttonHelpCrowd.addEventListener("click", helpCrowd);

showNextQuestion();
