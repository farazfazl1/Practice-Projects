// Write our PURE REDUX CODE WITHOUT REACT
import { combineReducers, createStore } from "redux";

const initalState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

const initialStateCustomer = {
  fullName: "",
  nationalID: "",
  created_at: "",
};

function accountReducer(state = initalState, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
      };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };

    case "account/requestLoan":
      // Only give loan if no loan exists on the account
      if (state.loan > 0) return;
      else {
        return {
          ...state,
          loan: action.payload.amount,
          loanPurpose: action.payload.purpose,
          balance: state.balance + action.payload.amount,
        };
      }

    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };

    default:
      return state; //For redux use state because if it does not know it, it shall just return the state back
  }
}

function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalID: action.payload.nationalID,
        created_at: action.payload.created_at,
      };

    case "customer/updateName":
      return {
        ...state,
        fullName: action.payload,
      };

    default:
      return state;
  }
}
// Redux Store
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});

const store = createStore(rootReducer);

function deposit(amount) {
  return store.dispatch({
    type: "account/deposit",
    payload: amount,
  });
}
function withdraw(amount) {
  return store.dispatch({
    type: "account/withdraw",
    payload: amount,
  });
}
function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount,
      purpose,
    },
  };
}
function payLoan() {
  return store.dispatch({
    type: "account/payLoan",
  });
}

console.log(deposit(100));
console.log(withdraw(50));
console.log(requestLoan(1000, "Buy a cheap car"));
console.log(payLoan());

// ===============================================================================
function createCustomer(fullName, nationalID) {
  return {
    type: "customer/createCustomer",
    payload: {
      fullName,
      nationalID,
      created_at: new Date().toISOString(),
    },
  };
}

function updateName(fullName) {
  return {
    type: "account/updateName",
    payload: fullName,
  };
}

store.dispatch(createCustomer("Faraz Fazl", "1083657"));
store.dispatch(deposit(200));
console.log(store.getState());
