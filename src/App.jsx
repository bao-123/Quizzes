import { useState, useEffect } from 'react';

import './App.css';
import Setting from './setting.jsx';
import Quiz from './quiz.jsx';

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
    const [settings, setSettings] = useState({
        category: '',
        tags: [],
        difficulty: 'easy',
    });

    return (
        <>
            <Setting settingState={settings} setSetting={setSettings} />
            <h1>Welcome to Quiz Game!</h1>
            <Quiz settingState={settings} />
        </>
    );
}

export default App;
