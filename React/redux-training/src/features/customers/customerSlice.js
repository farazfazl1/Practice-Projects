const initialStateCustomer = {
  fullName: "",
  nationalID: "",
  created_at: "",
};

export default function customerReducer(state = initialStateCustomer, action) {
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

export function createCustomer(fullName, nationalID) {
  return {
    type: "customer/createCustomer",
    payload: {
      fullName,
      nationalID,
      created_at: new Date().toISOString(),
    },
  };
}

export function updateName(fullName) {
  return {
    type: "account/updateName",
    payload: fullName,
  };
}
