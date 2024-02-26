import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedQuiz from "./FinishedQuiz";
import RestartButton from "./RestartButton";
import Footer from "./Footer";
import Timer from "./Timer";

const SECONDS_PER_QUESTION = 30;
const initialState = {
  questions: [],

  // loading, error, ready, active, finish
  status: "loading",
  index: 0, //for picking qhich question should we start from in index
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION, //we are saying we will give you 30 second per question based opn the number of questions you will have to answer
      };

    case "newAnswer":
      const question = state.questions.at(state.index); //Getting the current and correct question to be able to increase the points if question is correct
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption //if the answer from action playload is as the same as the correct option ov the  current question, then
            ? //we will incrememnt by the score of that question's point else dont give any points
              state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index++,
        answer: null,
      };

    case "finished":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore, //if greater than current high score, then will assign to current value score
      };

    case "restart":
      return {
        ...initialState,
        status: "ready",
        highscore: state.highscore,
        questions: state.questions,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status, //Allowing us to make sure if it reaches 0 then quiz is done
      };

    default:
      throw new Error("Action Unknown");
  }
}

function App() {
  const [
    { secondsRemaining, highscore, points, answer, index, questions, status },
    dispatch,
  ] = useReducer(reducer, initialState);

  const questionsLength = questions.length;
  const maxPossiblePoints = questions.reduce((acc, cur) => acc + cur.points, 0); //getting the maximum points

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) =>
        dispatch({
          type: "dataReceived",
          payload: data,
        })
      )
      .catch((err) =>
        dispatch({
          type: "dataFailed",
        })
      );
  }, []);

  return (
    <div>
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={questionsLength} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              i={index}
              numQuestions={questionsLength}
              points={points}
              allPoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions.at(index)}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={questionsLength}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <>
            <FinishedQuiz
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              highscore={highscore}
            />
            <RestartButton dispatch={dispatch} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
