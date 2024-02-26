function Option({ question, dispatch, answer }) {
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => {
        return (
          <button
            className={`btn btn-option ${index === answer ? "answer" : ""} ${
              hasAnswered
                ? index === question.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
            key={option}
            disabled={hasAnswered}
            onClick={() =>
              dispatch({
                type: "newAnswer",
                payload: index, //picking based on index. Got index from map method
              })
            }
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Option;
