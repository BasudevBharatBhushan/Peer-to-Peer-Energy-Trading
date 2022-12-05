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

export const getAllCards = () => {
  console.log("getAllCard API Triggered");
  return fetch(`${API}/card/all`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};
