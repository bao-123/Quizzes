import { useState, useEffect } from 'react';


import './App.css';
import Setting from './setting.jsx';
import Quiz from './quiz.jsx';

const API_KEY = import.meta.env.VITE_API_KEY;


function App() {

  const [settings, setSettings] = useState({
      category: '',
      tags: [],
      difficulty: "easy"
  });

  async function getQuiz(difficulty, category, tags=[], questions=10) {
        try {
          const params = [
          `apiKey=${API_KEY}`,
          `difficulty=${difficulty}`,
          `category=${category}`,
          `limit=${questions}`,
          `tags=${
            tags.join(",")
          }`];
          
          const response = await fetch(`https://quizapi.io/api/v1/questions?${params.join("&")}`);
          if(response.status !== 200) return undefined;

          return (await response.json());
        } catch (error) {
          console.error(error);
        }
  }

  return (
    <>
      <Setting 
      settingState={settings}
      setSetting={setSettings}
      />
        <h1>Welcome to Quiz Game!</h1>
      <Quiz />
    </>
  )
}

export default App;
