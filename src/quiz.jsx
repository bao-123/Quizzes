import './quizzes.css';
import { API_KEY, baseURL } from './config.jsx';
import { useEffect, useState } from 'react';

/**
 * Quiz component that fetches and displays a series of quiz questions.
 * Allows users to select answers, submit them, and view their score.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.settingState - The settings for fetching quizzes.
 * @param {string} props.settingState.difficulty - The difficulty level of the quizzes.
 * @param {string} props.settingState.category - The category of the quizzes.
 * @param {Array<string>} props.settingState.tags - The tags associated with the quizzes.
 * @returns {JSX.Element} The rendered Quiz component.
 */

function Quiz({ settingState }) {
    const [quizzes, setQuizzes] = useState([]);
    //* State for the current answer that is being chosen by the user
    const [currentAnswer, setCurrentAnswer] = useState('');
    //* State for the current question
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    //*State for checking if user submitted or not
    const [isSubmitted, setIsSubmitted] = useState(false);
    //*State for score
    const [score, setScore] = useState(0);
    //*Error message
    const [errorMessage, setErrorMessage] = useState('');

    /*
     * Fetch and display quizzes based on the provided settings.
     */
    async function getQuiz(difficulty, category, tags = [], questions = 20) {
        try {
            //*Parameters
            const params = [
                `apiKey=${API_KEY}`,
                `difficulty=${difficulty}`,
                `category=${category}`,
                `limit=${questions}`,
                `tags=${tags.join(',')}`,
            ];

            //*Fetch data
            const response = await fetch(`${baseURL}/api/v1/questions?${params.join('&')}`);
            //* set error message if the response status is not 200
            if (response.status !== 200) {
                setErrorMessage('Failed to get quizzes(setting may not valid)');
                return [];
            }
            //* If fetch data successfully, set error message to '' to hide the error display div
            setErrorMessage('');

            return await response.json();
        } catch (error) {
            console.error(error);
            setErrorMessage('Error occurred while processing..., please try again later');
            return [];
        }
    }

    return (
        <>
            {/* Button for fetching new quizzes and displaying them */}
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

            {/* display error (if there is) */}
            {errorMessage ? (
                <div className="errorDisplay">
                    <h3>Error while fetching quizzes</h3>
                    <p>{errorMessage}</p>
                </div>
            ) : (
                ''
            )}

            {/*Displaying score and quizzes */}
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
                                <p className="quizDesc">
                                    {quiz.description || "This quizz doesn't have a description"}
                                </p>
                                <p className="quizExpl">
                                    {quiz.explanation || "This quizz doesn't have a explanation"}
                                </p>
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
