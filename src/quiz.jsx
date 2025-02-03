import './quizzes.css';
import { API_KEY, baseURL } from './config.jsx';
import { useEffect, useState } from 'react';

function Quiz({ settingState }) {
    const [quizzes, setQuizzes] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    async function getQuiz(difficulty, category, tags = [], questions = 20) {
        try {
            const params = [
                `apiKey=${API_KEY}`,
                `difficulty=${difficulty}`,
                `category=${category}`,
                `limit=${questions}`,
                `tags=${tags.join(',')}`,
            ];

            const response = await fetch(`${baseURL}/api/v1/questions?${params.join('&')}`);
            if (response.status !== 200) return undefined;

            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log(quizzes);
    }, [quizzes]);

    return (
        <>
            <button
                id="startButton"
                onClick={async e => {
                    setIsSubmitted(false);
                    setCurrentQuestionIndex(0);
                    setCurrentAnswer('');

                    const data = await getQuiz(settingState.difficulty, settingState.category, settingState.tags);
                    if (typeof data === 'undefined') {
                        e.target.className = 'errorBtn';
                        e.target.textContent = 'Failed to get quizzes!';
                        console.error('Failed to get quizzes');
                    }
                    setQuizzes(data);
                }}
            >
                {quizzes.length == 0 ? 'Start' : 'Get new quizzes'}
            </button>
            <h3>Score: {score}</h3>
            <div id="displayQuizzes">
                {quizzes.map((quiz, index) => {
                    return (
                        <div className={'quiz ' + (index == currentQuestionIndex ? 'show' : '')} key={index}>
                            <p className="questions">{quiz.question}</p>

                            <div className="answersContainer">
                                {Object.keys(quiz.answers).map((value, index) => {
                                    if (quiz.answers[value] === null) return;
                                    const isCorrect = quiz.correct_answers[value + '_correct'] === 'true';

                                    return (
                                        <div
                                            key={index}
                                            className={
                                                'answer ' +
                                                (currentAnswer == value ? 'chosen' : 'unchosen') +
                                                //*Don't forget the ' ' between classes
                                                (isSubmitted
                                                    ? value === currentAnswer && isCorrect
                                                        ? ' correctAnswer'
                                                        : ' wrongAnswer'
                                                    : '')
                                            }
                                            onClick={e => {
                                                setCurrentAnswer(value);
                                            }}
                                        >
                                            <p>{quiz.answers[value]}</p>
                                            {isSubmitted ? (
                                                <i className={'fa-solid ' + (isCorrect ? 'fa-check' : 'fa-xmark')}></i>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={'quizInfo ' + (isSubmitted ? 'show' : '')}> 
                                <p className="quizDesc">{quiz.description || "This quizz doesn't have a description"}</p>
                                <p className="quizExpl">{quiz.explanation || "This quizz doesn't have a explanation"}</p>
                            </div>

                            <button
                                className={'submitButton ' + (currentAnswer === '' ? 'disabled' : '')}
                                onClick={e => {
                                    if (currentAnswer === '') return;
                                    if (!isSubmitted) {
                                        if (quiz.correct_answers[currentAnswer + '_correct'] === 'true') {
                                            setScore(score + 1);
                                        }
                                    }
                                    setIsSubmitted(true);
                                }}
                            >
                                Submit
                            </button>

                            {isSubmitted ? (
                                <button
                                    className="nextButton"
                                    onClick={() => {
                                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                                        setIsSubmitted(false);
                                        setCurrentAnswer('');
                                    }}
                                >
                                    Next
                                </button>
                            ) : (
                                ''
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Quiz;
