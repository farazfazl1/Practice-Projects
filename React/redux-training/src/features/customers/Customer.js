import { useSelector } from "react-redux";

function Customer() {
  // Way to access the store by Provider in index.js from our redux is using useSelector
  const customer = useSelector((store) => store.customer.fullName);
  console.log(customer);
  return <h2>👋 Welcome, {customer}</h2>;
}

export default Customer;
