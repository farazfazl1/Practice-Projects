/**
 * the value attribute of the <progress> element in this component represents the
 * progress made in the quiz or questionnaire. It equals the current question
 * number (i) plus 1 if the user has already answered the current question, and it
 *  equals the current question number (i) if the user has not yet answered the current question.
 */

function Progress({ i, numQuestions, points, allPoints, answer }) {
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={i + Number(answer !== null)}
      ></progress>
      <p>
        Question <strong>{i + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {allPoints}
      </p>
    </header>
  );
}

export default Progress;
