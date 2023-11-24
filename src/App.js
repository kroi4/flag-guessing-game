import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import countryTranslations from './hebcountries.json';

function App() {
  const [currentFlag, setCurrentFlag] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [countries, setCountries] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  let hebrewToEnglish = {};
  countryTranslations.forEach(translation => {
    hebrewToEnglish[translation.Hebrew.trim()] = translation.English.toLowerCase();
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const countryData = data.map(country => ({
          name: country.name.common, 
          flag: country.flags.png
        }));
        setCountries(countryData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const chooseRandomFlag = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    setCurrentFlag(countries[randomIndex].flag);
    setCorrectAnswer(countries[randomIndex].name);
    setUserGuess('');
    setFeedback('');
  }, [countries]); // הוספת התלות כאן

  useEffect(() => {
    if (countries.length > 0) {
      chooseRandomFlag();
    }
  }, [countries, chooseRandomFlag]); // הוספת chooseRandomFlag למערך התלויות

  const handleGuessChange = (event) => {
    setUserGuess(event.target.value);
  };

  const checkAnswer = () => {
    const normalizedUserGuess = userGuess.trim();
    const correctEnglish = correctAnswer.toLowerCase();
  
    // מתרגם את הניחוש מעברית לאנגלית
    const translatedGuess = hebrewToEnglish[normalizedUserGuess] || normalizedUserGuess;
  
    console.log(`Translated guess: ${translatedGuess}`);
  
    if (translatedGuess.toLowerCase() === correctEnglish) {
      setFeedback('נכון! זהו הדגל של ' + normalizedUserGuess);
    } else {
      setFeedback('לא נכון, נסה שוב');
    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>נחש את הדגל</h1>
        {currentFlag && <img src={currentFlag} alt="Flag" />}
        <input
          type="text"
          value={userGuess}
          onChange={handleGuessChange}
          placeholder="הזן את שם המדינה..."
        />
        <div className="button-group">
          <button onClick={checkAnswer}>בדוק</button>
          <button onClick={chooseRandomFlag}>הבא</button>
        </div>
        {feedback && <p>{feedback}</p>}
      </header>
    </div>
  );
}

export default App;
