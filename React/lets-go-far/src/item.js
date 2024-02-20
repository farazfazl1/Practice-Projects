function Item({ item, onDeleteItem, onCheckboxItem }) {
  return (
    <>
      <li>
        <input
          type="checkbox"
          value={item.packed}
          onChange={() => onCheckboxItem(item.id)}
        ></input>
        <span style={item.packed ? { textDecoration: "line-through" } : {}}>
          {item.quantity} {item.description}
        </span>
        <button onClick={() => onDeleteItem(item.id)}>❌</button>
      </li>
    </>
  );
}

export default Item;
