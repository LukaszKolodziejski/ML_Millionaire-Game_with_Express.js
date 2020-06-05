const gameRoute = (app) => {
  let goodAnswer = 0;
  let gameOver = false;
  let helpFriendUsed = false;
  let helpHalfUsed = false;
  let helpCrowdUsed = false;

  const questions = [
    {
      question: "The best programming language in the world: ",
      answers: ["Go", "Javascript", "C++", "Java"],
      correct: 1,
    },
    {
      question: "Express.js is associated with: ",
      answers: ["Sass", "React", "Node.js", "React Native"],
      correct: 2,
    },
    {
      question: "Who will you be in programming: ",
      answers: ["Junior", "Regular", "Senior", "Expert"],
      correct: 2,
    },
  ];

  // displays data on front

  // create JSON on server
  app.get("/question", (req, res) => {
    if (goodAnswer === questions.length) {
      res.json({ winner: true });
    } else if (gameOver) {
      res.json({ looser: true });
    } else {
      const nextQuestion = questions[goodAnswer];
      const { question, answers } = nextQuestion;

      res.json({ question, answers });
    }
  });

  // Sends data to front
  app.post("/answer/:index", (req, res) => {
    if (gameOver) res.json({ looser: true });
    // index to String !!!
    const { index } = req.params;
    const question = questions[goodAnswer];
    const isGoodAnswer = question.correct === 1 * index;

    if (isGoodAnswer) {
      goodAnswer++;
    } else {
      gameOver = true;
    }

    res.json({
      correct: isGoodAnswer,
      goodAnswer,
    });
  });

  app.get("/help/friend", (req, res) => {
    if (helpFriendUsed) {
      return res.json({
        text: "You used this button",
      });
    }
    helpFriendUsed = true;
    const randomAnswer = Math.random() < 0.5;
    const question = questions[goodAnswer];
    res.json({
      text: randomAnswer
        ? `I know the answer: ${question.answers[question.correct]}`
        : "I do not know the answer :(",
    });
  });

  app.get("/help/half", (req, res) => {
    if (helpHalfUsed) {
      return res.json({
        text: "You used this button",
      });
    }
    helpHalfUsed = true;

    const question = questions[goodAnswer];
    const answersCopy = question.answers.filter(
      (s, index) => index !== question.correct
    );
    console.log(answersCopy);
    answersCopy.splice(~~(Math.random() * answersCopy.length), 1);
    console.log(answersCopy);

    res.json({
      answersToRemove: answersCopy,
    });
  });

  app.get("/help/crowd", (req, res) => {
    if (helpCrowdUsed) {
      return res.json({
        text: "You used this button",
      });
    }
    helpCrowdUsed = true;

    let voiceOfCrowd = [10, 20, 30, 40];
    for (let i = voiceOfCrowd.length - 1; i > 0; i--) {
      const change = Math.floor(Math.random() * 20) - 10;
      voiceOfCrowd[i] += change;
      voiceOfCrowd[i - 1] -= change;
    }

    const { correct } = questions[goodAnswer];

    [voiceOfCrowd[correct], voiceOfCrowd[3]] = [
      voiceOfCrowd[3],
      voiceOfCrowd[correct],
    ];

    res.json({
      voiceOfCrowd,
    });
  });
};

module.exports = gameRoute;
