import { isAuthenticated } from "../../auth/helper";
import { API } from "../../backend";

export const createTxn = (txn) => {
  return fetch(`${API}/transaction/create`, {
    method: "POST",
    headers: {
      Accept: "applicaton/json",
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

export const getTxns = () => {
  return fetch(`${API}/transaction/all`)
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};

export const getTxnById = (txnId) => {
  return fetch(`${API}/transaction/${txnId}`)
    .then((response) => {
      return response;
    })
    .catch((err) => console.log(err));
};
