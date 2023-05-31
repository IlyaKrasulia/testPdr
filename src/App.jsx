import { useEffect, memo, useState } from "react";
import "./App.css";
import { questions } from "./questionsList";
import { useTimer } from "react-timer-hook";

// Timer

const Timer = memo(({ onTick, func, restartTimer }) => {
  const [timer, setTimer] = useState(true);

  let time = new Date();

  const { seconds, minutes, pause, resume, restart } = useTimer({
    expiryTimestamp: time.setSeconds(time.getSeconds() + 1200),
    onExpire: func,
    onTick: (time) => onTick(time),
  });

  useEffect(() => {
    if (restartTimer === true) {
      restart(time.setSeconds(1200), true);
    }
  }, [restartTimer]);

  const toggleTimer = () => {
    setTimer(!timer);
    if (timer) {
      pause();
    } else {
      resume();
    }
  };

  return (
    <div style={{ fontSize: "16px", display: "flex" }}>
      <span>{minutes}</span>:<span>{seconds}</span>
      <div className="timer__handler">
        <input type="checkbox" onChange={toggleTimer} /> таймер
      </div>
    </div>
  );
});

// ---

function App() {
  const [items, setItems] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [trueAnswer, setTrueAnswer] = useState(0);
  const [falseAnswer, setFalseAnswer] = useState(0);
  const [resultModal, setResultModal] = useState(false);
  const [inputs, setInputs] = useState(false);
  const [timer, setTimer] = useState(true);

  const handleAnswer = (variant, trueVariant, index) => {
    const isCorrect = variant === trueVariant;
    if (isCorrect) {
      setTrueAnswer((prev) => prev + 1);
    } else {
      setFalseAnswer((prev) => prev + 1);
    }

    let updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], presable: false };
    setItems(updatedItems);
    console.log("true", " :", trueAnswer, " ", "false", " :", falseAnswer);
    setTotalQuestions(totalQuestions - 1);

    if (totalQuestions === 1) {
      setResultModal(true);
      getRandomObjects();
      setTotalQuestions(20);
      window.scrollTo(0, 0);
    }
  };

  let time = new Date();
  time.setSeconds(time.getSeconds() + 2000);

  const getRandomObjects = () => {
    const randomObjects = [];
    const dataCopy = [...questions];
    console.log(randomObjects);

    while (randomObjects.length < 20 && dataCopy.length > 0) {
      const randomIndex = Math.floor(Math.random() * dataCopy.length);
      const randomObject = dataCopy.splice(randomIndex, 1)[0];
      randomObjects.push(randomObject);
    }

    setItems(randomObjects);
  };

  useEffect(() => {
    getRandomObjects();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">Іспит з ПДР України 2023</h1>
        <div className="test__items">
          {items.map((item, index) => {
            return (
              <div className="test__item" key={index}>
                <h2 className="test__title">{item.title}</h2>
                <p className="test__question">{item.question}</p>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    className="test__img"
                    alt="Question"
                    style={{ width: "100%" }}
                  />
                )}
                <form className="test__variants">
                  {item.variants.map((variant, variantIndex) => {
                    return (
                      <label
                        className={`test__variant ${
                          item.presable
                            ? ""
                            : variant === item.trueVariant
                            ? "test__variant--true"
                            : "test__variant--false"
                        }`}
                        key={variantIndex}
                      >
                        <input
                          type="radio"
                          checked={inputs}
                          onChange={() => {
                            handleAnswer(variant, item.trueVariant, index);
                          }}
                          disabled={!item.presable}
                        />
                        <p className="test__variant-text">{variant}</p>
                      </label>
                    );
                  })}
                </form>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bottom-bar">
        <div className="container">
          <h3 className="bottom-bar__title bottom-bar__text">Нові 2023</h3>
          <h3 className="bottom-bar__precess bottom-bar__text">
            Залишилось <span>{totalQuestions}</span> питань
          </h3>
          {timer && (
            <Timer
              expiryTimestamp={time}
              func={() => {
                setResultModal(true);
                getRandomObjects();
                setInputs(false);
              }}
              restartTimer={resultModal}
            />
          )}
        </div>
      </div>
      {resultModal && (
        <div className="result-modal">
          <div className="result-modal__window">
            <button
              className="close__modal"
              onClick={() => {
                setResultModal(false);
                setTimer(false);
                setTimer(true);
                setFalseAnswer(0);
                setTrueAnswer(0);
              }}
            >
              +
            </button>
            <h2 className="result-modal__title">ВАШ РЕЗУЛЬТАТ</h2>
            <h3 className={trueAnswer > 18 ? "test__passed" : "test__failed"}>
              {trueAnswer > 18 ? "Складено" : "Не складено"}
            </h3>
            <div className="result-modal__info">
              <div className="result-modal__info-item">
                <p>Відповіли правильно:</p>
                <p>
                  {trueAnswer} з {items.length}
                </p>
              </div>
              <div className="result-modal__info-item">
                <p>Прохiдний бал:</p>
                <p>90%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
