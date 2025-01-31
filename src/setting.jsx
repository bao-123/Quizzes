import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_API_KEY;

function Setting({settingState, setSetting}) {
    const difficulties = ["easy", "medium", "hard"];
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);

    async function getOptions(optionsFor="tags") {
        console.log("API called");
        try {
            const response = await fetch(`https://quizapi.io/api/v1/${optionsFor}?apiKey=${API_KEY}`);

            if(response.status !== 200) return undefined;
            const data = (await response.json()); 
            if(optionsFor == "tags")
                setTags(data.map((value) => value.name))
            else if(optionsFor == "categories")
                setCategories(data.map((value) => value.name));
            else
                return undefined;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getOptions("tags");
        getOptions("categories");
    }, []);

    return (
        <>
            <form onSubmit={e => e.preventDefault()}>
                
                <label htmlFor="difficultySelect">Difficulty</label>
                <select id="difficultySelect"
                    onChange={e => setSetting({
                        ...settingState,
                        difficulty: e.target.value
                    })}
                >

                    {difficulties.map((value, index) => <option key={index} value={value}>{value}</option>)}
                </select>

                <label htmlFor="CategorySelect">Category</label>
                <datalist id="categoryList">
                    {
                        categories.map((value, index) => <option key={index} value={value}>{value}</option>)
                    }
                </datalist>
                
                <input type="text" 
                list="categoryList"
                placeholder="Category"
                value={settingState.category} 
                onChange={e => {
                        setSetting({
                            ...settingState,
                            category: e.target.value
                            });
                }}/>
                
            </form>
        </>
    )
}

export default Setting;