function StartScreen({ numQuestions, dispatch }) {
  return (
    <div>
      <h2>Welcome to the Quiz</h2>
      <h3>{numQuestions} Questions to test your react mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() =>
          dispatch({
            type: "start",
          })
        }
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
