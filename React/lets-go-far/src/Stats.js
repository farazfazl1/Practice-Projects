function Stats({ numItems, packedItems, percentage }) {
  if (!numItems) {
    return (
      <>
        <footer className="stats">
          <em>Start adding some items to your packing list 🚀</em>
        </footer>
      </>
    );
  }

  return (
    <>
      <footer className="stats">
        {numItems === packedItems ? (
          <em>You got everything! Ready to go ✈</em>
        ) : (
          <em>
            You have {numItems} items on your list, and you already packed{" "}
            {packedItems} ({percentage}%)
          </em>
        )}
      </footer>
    </>
  );
}
export default Stats;
