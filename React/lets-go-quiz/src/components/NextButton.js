function NextButton({ dispatch, answer, index, numQuestions }) {
  if (answer === null) return null;

  //Change the button and its dispatch to finish after the user has answerred all 15 questions
  if (index < numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() =>
          dispatch({
            type: "nextQuestion",
          })
        }
      >
        Next
      </button>
    );
  }

  if (index === numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() =>
          dispatch({
            type: "finished",
          })
        }
      >
        Finish
      </button>
    );
  }

  if (dispatch.type === "finished") {
    console.log(`Hello`);
  }
}

export default NextButton;
