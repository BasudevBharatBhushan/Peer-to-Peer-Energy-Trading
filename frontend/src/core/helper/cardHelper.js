import { isAuthenticated } from "../../auth/helper";
import { API } from "../../backend";

export const createCard = (prosumer, token, card) => {
  console.log("Api Triggered");
  return fetch(`${API}/card/create/${prosumer._id}`, {
    method: "POST",
    headers: {
      Accept: "applicaton/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(card),
  })
    .then((response) => {
      console.log("response...", response);
      return response;
    })
    .catch((err) => console.log(err));
};

export const deleteCard = (cardID) => {
  return fetch(`${API}/card/${cardID}`, {
    method: "DELETE",
  })
    .then((response) => {
      console.log("response._id", response);
      return response;
    })
    .catch((err) => console.log(err));
};

export const updateCard = (cardID, card) => {
  return fetch(`${API}/card/${cardID}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(card),
  })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((err) => console.log(err));
};
