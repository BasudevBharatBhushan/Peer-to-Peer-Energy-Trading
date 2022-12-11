import { API } from "../../backend";

export const createTxn = (txn) => {
  return fetch(`${API}/transaction/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(txn),
  })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};

export const getAllTransaction = () => {
  return fetch(`$API/transaction/all`)
    .then((response) => {
      console.log("Txn Response", response);
      return response;
    })
    .catch((err) => console.log(err));
};
