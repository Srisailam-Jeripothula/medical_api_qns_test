const startBtn = document.getElementById("startBtn");
const topicInput = document.getElementById("topic");
const difficultySelect = document.getElementById("difficulty");
const quizContainer = document.getElementById("quiz-container");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options-list");
const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");
const resultText = document.getElementById("result");

let questions = [];
let currentQuestionIndex = 0;
let selectedOption = null;

startBtn.addEventListener("click", async () => {
  const topic = topicInput.value.trim();
  const difficulty = difficultySelect.value;

  if (!topic || !difficulty) {
    alert("Please enter a topic and select a difficulty.");
    return;
  }

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty }),
    });

    const data = await response.json();
    questions = data.data;
    currentQuestionIndex = 0;

    if (questions.length === 0) {
      alert("No questions received.");
      return;
    }

    document.getElementById("form-container").classList.add("hidden");
    quizContainer.classList.remove("hidden");
    showQuestion();
  } catch (error) {
    alert("Failed to fetch questions.");
    console.error(error);
  }
});

function showQuestion() {
  const current = questions[currentQuestionIndex];
  questionText.textContent = current.question;
  optionsList.innerHTML = "";
  resultText.classList.add("hidden");
  submitBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");

  current.options.forEach((option) => {
    const li = document.createElement("li");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "option";
    radio.value = option;

    radio.addEventListener("change", () => {
      selectedOption = option;
    });

    li.appendChild(radio);
    li.appendChild(document.createTextNode(" " + option));
    optionsList.appendChild(li);
  });
}

submitBtn.addEventListener("click", () => {
  if (!selectedOption) {
    alert("Please select an option.");
    return;
  }

  const current = questions[currentQuestionIndex];
  const isCorrect = selectedOption === current.answer;
  resultText.textContent = isCorrect
    ? "✅ Correct!"
    : `❌ Wrong. Correct answer: ${current.answer}`;
  resultText.classList.remove("hidden");

  submitBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
});

nextBtn.addEventListener("click", () => {
  selectedOption = null;
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    quizContainer.innerHTML = "<h2>🎉 Quiz Completed!</h2>";
  }
});
