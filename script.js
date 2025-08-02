// DOM要素の取得
const quizContainer = document.querySelector('.quiz-container');
const resultContainer = document.getElementById('result-container');
const questionElement = document.getElementById('question');
const quizNumberElement = document.getElementById('quiz-number');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const explanationContainer = document.getElementById('explanation-container');
const nextBtn = document.getElementById('next-btn');
const retryBtn = document.getElementById('retry-btn');
const scoreText = document.getElementById('score-text');

// グローバル変数
let allQuizData = []; // JSONから読み込んだ全クイズデータ
let shuffledQuestions = []; // シャッフルされたクイズデータ
let currentQuestionIndex = 0; // 現在の問題のインデックス
let score = 0; // 正解数

/**
 * Fisher-Yatesアルゴリズムを用いて配列をシャッフルする
 * @param {Array} array シャッフルしたい配列
 * @returns {Array} シャッフルされた新しい配列
 */
function shuffleArray(array) {
    const newArray = [...array]; // 元の配列をコピー
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 要素を交換
    }
    return newArray;
}

/**
 * 現在の問題と選択肢を画面に表示する
 */
function displayQuestion() {
    // コンテナをリセット
    feedbackContainer.innerHTML = '';
    explanationContainer.innerHTML = '';
    explanationContainer.classList.add('hidden');
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = '';

    // 現在の問題データを取得
    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    // 問題番号と問題文を表示
    quizNumberElement.textContent = `問題 ${currentQuestionIndex + 1}`;
    questionElement.textContent = currentQuestion.question;

    // 選択肢ボタンを生成して表示
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = `${option.label}. ${option.text}`;
        button.dataset.label = option.label; // ボタンに答えのラベルを保存
        button.addEventListener('click', selectAnswer);
        optionsContainer.appendChild(button);
    });
}

/**
 * ユーザーが選択肢をクリックした際の処理
 * @param {Event} event クリックイベントオブジェクト
 */
function selectAnswer(event) {
    const selectedButton = event.target;
    const selectedLabel = selectedButton.dataset.label;
    const correctLabel = shuffledQuestions[currentQuestionIndex].answer;

    // すべての選択肢ボタンを無効化
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
        // 正解の選択肢をハイライト
        if (button.dataset.label === correctLabel) {
            button.classList.add('correct');
        }
    });

    // 正解・不正解の判定とフィードバック
    if (selectedLabel === correctLabel) {
        score++;
        feedbackContainer.textContent = '正解！';
        feedbackContainer.style.color = '#2f855a'; // 緑色
    } else {
        selectedButton.classList.add('incorrect');
        feedbackContainer.textContent = '不正解...';
        feedbackContainer.style.color = '#c53030'; // 赤色
    }

    // 解説を表示
    explanationContainer.textContent = shuffledQuestions[currentQuestionIndex].explanation;
    explanationContainer.classList.remove('hidden');

    // 「次の問題へ」ボタンを表示
    nextBtn.classList.remove('hidden');
}

/**
 * 最終結果を表示する
 */
function showResult() {
    // クイズコンテナを非表示にし、結果コンテナを表示
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    // スコアを表示
    scoreText.textContent = `あなたのスコア: ${shuffledQuestions.length}問中 ${score}問正解！`;
}

/**
 * ゲームを開始する
 */
function startGame() {
    // スコアとインデックスをリセット
    score = 0;
    currentQuestionIndex = 0;

    // 問題をシャッフル
    shuffledQuestions = shuffleArray(allQuizData);

    // 結果コンテナを非表示にし、クイズコンテナを表示
    resultContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');

    // 最初の問題を表示
    displayQuestion();
}

/**
 * JSONファイルからクイズデータを非同期で読み込む
 */
async function loadQuizData() {
    try {
        const response = await fetch('computer_network.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allQuizData = await response.json();
        // データロード成功後、ゲームを開始
        startGame();
    } catch (error) {
        questionElement.textContent = 'クイズの読み込みに失敗しました。ページを再読み込みしてください。';
        console.error('クイズデータの読み込みに失敗:', error);
    }
}

/**
 * アプリケーションの初期化
 */
function init() {
    // イベントリスナーを設定
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuestions.length) {
            displayQuestion();
        } else {
            showResult();
        }
    });

    retryBtn.addEventListener('click', startGame);

    // クイズデータを読み込む
    loadQuizData();
}

// アプリケーションの実行開始
init();