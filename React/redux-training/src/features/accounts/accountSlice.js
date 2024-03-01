// Slice is a part of the total state

const initalState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};
const host = "api.frankfurter.app";
export default function accountReducer(state = initalState, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
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

    case "account/convertingCurrency":
      return {
        ...state,
        isLoading: true,
      };

    default:
      return state; //For redux use state because if it does not know it, it shall just return the state back
  }
}

export function deposit(amount, currency) {
  if (currency === "USD") {
    return {
      type: "account/deposit",
      payload: amount,
    };
  }

  // MIDDLEWEAR PURPOSES AND DOING OUR API CALL HERE WE RETURN FUNCTION
  return async function (dispatch, getState) {
    // API CALL

    dispatch({ type: "account/convertingCurrency" });
    const res = await fetch(
      `https://${host}/latest?amount=${amount}&from=${currency}&to=USD`
    );

    const data = await res.json();
    const converted = data.rates.USD;
    console.log(converted);

    // Return action
    dispatch({
      type: "account/deposit",
      payload: converted,
    });
  };
}
export function withdraw(amount) {
  return {
    type: "account/withdraw",
    payload: amount,
  };
}
export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount,
      purpose,
    },
  };
}
export function payLoan() {
  return {
    type: "account/payLoan",
  };
}
