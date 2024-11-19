import { useReducer } from "react";
import "./styles.css";

/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (except for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

const DEPOSIT_AMOUNT = 150;
const WITHDRAW_AMOUNT = 50;
const LOAN_AMOUNT = 5000;

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  hasLoan: false,
};

function reducer(state, action) {
  if (!state.isActive && action.type !== "openAccount") return state;

  switch (action.type) {
    // cases: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount

    case "openAccount":
      return {
        ...state,
        balance: 500,
        isActive: true,
      };

    case "deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
      };

    case "withdraw":
      return {
        ...state,
        balance:
          state.balance < WITHDRAW_AMOUNT
            ? state.balance
            : state.balance - action.payload,
      };

    case "requestLoan":
      return {
        ...state,
        balance: state.hasLoan ? state.balance : state.balance + LOAN_AMOUNT,
        loan: LOAN_AMOUNT,
        hasLoan: true,
      };

    case "payLoan":
      return {
        ...state,
        balance: state.hasLoan ? state.balance - LOAN_AMOUNT : state.balance,
        loan: state.hasLoan ? 0 : state.loan,
        hasLoan: false,
      };

    case "closeAccount":
      return {};

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [{ balance, loan, isActive, hasLoan }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => {
            dispatch({ type: "openAccount" });
          }}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "deposit", payload: DEPOSIT_AMOUNT });
          }}
          disabled={!isActive}
        >
          Deposit {DEPOSIT_AMOUNT}
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "withdraw", payload: WITHDRAW_AMOUNT });
          }}
          disabled={!isActive}
        >
          Withdraw {WITHDRAW_AMOUNT}
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "requestLoan" });
          }}
          disabled={!isActive}
        >
          Request a loan of {LOAN_AMOUNT}
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "payLoan" });
          }}
          disabled={!isActive}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "closeAccount" });
          }}
          disabled={!isActive}
        >
          Close account
        </button>
      </p>
    </div>
  );
}
