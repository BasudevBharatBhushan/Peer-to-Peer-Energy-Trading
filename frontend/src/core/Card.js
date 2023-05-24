import { useState, useEffect } from "react";
import Base from "./Base";
import { Link, Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { createCard, getAllCards } from "./helper/cardHelper";
import { API } from "../backend";


const Card = () => {
  const [obj, setObj] = useState([]);

  const [values, setValues] = useState({
    listProsumer: undefined,
    unitPriceUSD: "",
    unitPriceMatic: "",
    stakedEnergy: "",
  });
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { listProsumer, unitPriceUSD, unitPriceMatic, stakedEnergy } = values;
  const { prosumer, token } = isAuthenticated();

  useEffect(() => {
    fetch(`${API}/card/all`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setObj(data);
        console.log("OBJECTS", obj[0]);
      });
  }, []);

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      listProsumer: prosumer,
      [name]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    console.log("VALUES- ", values);

    setError("");
    setSuccess(false);
    createCard(prosumer, token, { values }).then((data) => {
      if (data.error) {
        setError(true);
      } else {
        setError("");
        setSuccess(true);
        setValues("");
      }
    });
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category Created Sucessfully</h4>;
    }
  };

  const warningMessage = () => {
    if (error) {
      return <h4 className="text-danger">Failed to create category</h4>;
    }
  };

  // const getAllCards = () => {
  //   console.log("getAllCard API Triggered");
  //   return fetch(`${API}/card/all`, {
  //     method: "GET",
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       setObj(data);
  //       console.log(obj);
  //     });
  // };

  return (
    <div>
      <Base title="Card Page" />
      {/* {GetAllCards()} */}
      {obj &&
        obj.map((card) => {
          return (
            <div>
              <h1>{card._id}</h1>
            </div>
          );
        })}

      {/* <Form>
        <Form.Field>
          <label>unitPriceUSD</label>
          <input
            type="text"
            name=""
            onChange={handleChange("unitPriceUSD")}
            value={unitPriceUSD}
            placeholder="unitPriceUSD..."
          />
        </Form.Field>
        <Form.Field>
          <label>unitPriceMatic</label>
          <input
            type="text"
            name=""
            onChange={handleChange("unitPriceMatic")}
            value={unitPriceMatic}
            placeholder="unitPriceMatic..."
          />
        </Form.Field>
        <Form.Field>
          <label>stakedEnergy</label>
          <input
            type="text"
            name=""
            onChange={handleChange("stakedEnergy")}
            value={stakedEnergy}
            placeholder="stakedEnergy..."
          />
        </Form.Field>
        <Button onClick={onSubmit} type="submit">
          Submit
        </Button>
      </Form>
      {successMessage()}
      {warningMessage()} */}
    </div>
  );
};

export default Card;
