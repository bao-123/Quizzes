import "./quizzes.css";
import { API_KEY, baseURL } from "./config.jsx";
import { useEffect, useState } from "react";

function Quiz({settingState}) {
    const [quizzes, setQuizzes] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    async function getQuiz(difficulty, category, tags=[], questions=20) {
        try {
          const params = [
          `apiKey=${API_KEY}`,
          `difficulty=${difficulty}`,
          `category=${category}`,
          `limit=${questions}`,
          `tags=${
            tags.join(",")
          }`];
          
          const response = await fetch(`${baseURL}/api/v1/questions?${params.join("&")}`);
          if(response.status !== 200) return undefined;

          return (await response.json());
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        console.log(currentAnswer);
    }, [currentAnswer]);

    return (
    <>
        <button id="startButton"
        onClick={async e => {
            const data = await getQuiz(
                settingState.difficulty,
                settingState.category,
                settingState.tags,
            );
            if(typeof data === "undefined")
            {
                e.target.className = "errorBtn";
                e.target.textContent = "Failed to get quizzes!";
                console.error("Failed to get quizzes");
            }
            setQuizzes(data);
        }}
        >{quizzes.length == 0 ? "Start" : "Get new quizzes"}</button>

        <div id="displayQuizzes">
            {
                quizzes.map((quiz, index) => {
                  return (
                    <div className={"quiz " + (index == currentQuestionIndex ? "show" : "")} key={index}>
                        <p className="questions">{quiz.question}</p>
                        <p className="questionDescription">{quiz.description}</p>

                        <div className="answersContainer">
                            {
                                Object.keys(quiz.answers).map((value, index) => (
                                    <div 
                                    className={"answer" + (currentAnswer == value ? "chosenAnswer" : "unchosenAnswer")}
                                    data-is-correct={quiz.correct_answers[value+"_correct"]}
                                    onClick={e => {
                                        setCurrentAnswer(value);
                                    }}
                                    >
                                        <p>{quiz.answers[value]}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>  
                  )
                })
            }
        </div>
    </>
    );
}


export default Quiz;