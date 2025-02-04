import { useState, useEffect } from 'react';

import './App.css';
import Setting from './setting.jsx';
import Quiz from './quiz.jsx';

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
    //*Setting states (contains all setting like category, tags, difficulty)
    const [settings, setSettings] = useState({
        category: '',
        tags: [],
        difficulty: 'easy',
    });

    return (
        <>
            {/*
             * Setting component: contains all setting inputs.
            */}
            <Setting settingState={settings} setSetting={setSettings} />

            <h1>Welcome to Quiz Game!</h1>
            
            {
                //*Quiz component: contains questions, answers, and score.
            }
            <Quiz settingState={settings} />
        </>
    );
}

export default App;
