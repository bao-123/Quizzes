import "./quizzes.css";
import { API_KEY, baseURL } from "./config.jsx";
import { useEffect, useState } from "react";

function Quiz({settingState}) {
    const [quizzes, setQuizzes] = useState([]);

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

    function renderQuiz(quizzes) {
        const questions = quizzes.map((quiz, index) => {
            const answerEntries = Object.entries(quiz.answers);
            const correctAnswerEntries = Object.entries(quiz.correct_answers);

            const answers = answerEntries.map((entry, index) => {
                //* Labels is 'a', 'b', 'c',...
                const label = entry[0].charAt(0);
                //*Check if the answer is correct
                const isCorrect = (correctAnswerEntries[index][1] == "true");
                
                return {
                    label: label,
                    answerContent: entry[1],
                    isCorrect: isCorrect
                };
            })
            return {
                key: index,
                questions: quiz.questions,
                answers: answers,
                description: quiz.description,
                explanation: quiz.explanation,
                tags: quiz.tags,
            }
        })
    }
    useEffect(() => {
        console.log(quizzes);
    }, [quizzes]);

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
            
        </div>

    </>
    );
}


export default Quiz;