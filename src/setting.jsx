import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_KEY } from './config.jsx';

function Setting({ settingState, setSetting }) {
    const difficulties = ['easy', 'medium', 'hard'];
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);

    async function getOptions(optionsFor = 'tags') {
        console.log('API called');
        try {
            const response = await fetch(`https://quizapi.io/api/v1/${optionsFor}?apiKey=${API_KEY}`);

            if (response.status !== 200) return undefined;
            const data = await response.json();
            if (optionsFor == 'tags') setTags(data.map(value => value.name));
            else if (optionsFor == 'categories') setCategories(data.map(value => value.name));
            else return undefined;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getOptions('tags');
        getOptions('categories');
    }, []);

    //TODO Check if setting is valid
    useEffect(() => {
        console.log(settingState.category);
    }, [settingState]);

    return (
        <>
            <div className="SettingHeaders">
                <h2>Settings</h2>
                <i
                    className="fa-solid fa-arrow-up-short-wide"
                    onClick={e => {
                        e.target.className =
                            'fa-solid ' + (showForm ? 'fa-arrow-up-short-wide' : 'fa-arrow-down-short-wide');
                        setShowForm(!showForm);
                    }}
                ></i>
            </div>

            <form onSubmit={e => e.preventDefault()} id="settingForm" className={showForm ? 'show' : ''}>
                <div className="inputDiv">
                    <h2>Difficulty</h2>
                    <select
                        id="difficultySelect"
                        className="form-select w-50 mx-auto"
                        onChange={e =>
                            setSetting({
                                ...settingState,
                                difficulty: e.target.value,
                            })
                        }
                    >
                        {difficulties.map((value, index) => (
                            <option key={index} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="inputDiv">
                    <h2>Categories</h2>
                    <div className="selectDiv" id="categorySelect">
                        {categories.map((value, index) => {
                            return (
                                <div
                                    key={index}
                                    data-value={value}
                                    className={`tagSelectDiv ${
                                        settingState.category == value ? 'chosenTag' : 'unchosenTag'
                                    }`}
                                    onClick={e => {
                                        const category = e.target.dataset.value;
                                        setSetting({
                                            ...settingState,
                                            category: category == settingState.category ? '' : category,
                                        });
                                    }}
                                >
                                    {value}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="inputDiv">
                    <h2>Tags</h2>
                    <div id="tagSelect" className="selectDiv">
                        {tags.map((value, index) => {
                            return (
                                <div
                                    key={index}
                                    data-value={value}
                                    className={`tagSelectDiv ${
                                        settingState.tags.includes(value) ? 'chosenTag' : 'unchosenTag'
                                    }`}
                                    onClick={e => {
                                        const tag = e.target.dataset.value;
                                        console.log(tag);

                                        if (settingState.tags.includes(tag)) {
                                            console.log('remove tags');

                                            //*Remove the tags
                                            setSetting({
                                                ...settingState,
                                                tags: settingState.tags.filter(value => {
                                                    return value != tag;
                                                }),
                                            });
                                        } else {
                                            settingState.tags.push(tag);
                                            console.log(settingState.tags);

                                            setSetting({
                                                ...settingState,
                                            });
                                        }
                                    }}
                                >
                                    {value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </form>
        </>
    );
}

export default Setting;
