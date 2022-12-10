import { API } from "../../backend";

export const updateProsumer = (prosumerID, prosumer) => {
  console.log(prosumer);
  return fetch(`${API}/prosumer/${prosumerID}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prosumer),
  })
    .then((response) => {
      console.log("response", response);
      return response;
    })
    .catch((err) => console.log(err));
};

export const getProsumerById = (prosumerID) => {
  return fetch(`${API}/prosumer/${prosumerID}`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
