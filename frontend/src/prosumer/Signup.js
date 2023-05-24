import "../App.css";
import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";
import { Button, Form, Message } from "semantic-ui-react";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    publicAddress: "",
    password: "",
    error: "",
    success: false,
  });

  const { name, email, publicAddress, password, error, success } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ name, publicAddress, email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({
            ...values,
            name: "",
            email: "",
            publicAddress: "",
            password: "",
            error: "",
            success: true,
          });
        }
      })
      .catch(console.log("Error in Signup"));
  };

  const signUpForm = () => {
    return (
      <div className="form-container">
        <Form>
          <Form.Field>
            <label>Name</label>
            <input
              type="text"
              name=""
              onChange={handleChange("name")}
              value={name}
              placeholder="Name..."
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input
              type="email"
              name=""
              onChange={handleChange("email")}
              value={email}
              placeholder="Email..."
            />
          </Form.Field>
          <Form.Field>
            <label>Ethereum Wallet Address</label>
            <input
              type="text"
              name=""
              onChange={handleChange("publicAddress")}
              value={publicAddress}
              placeholder="0x..."
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              type="password"
              name=""
              onChange={handleChange("password")}
              value={password}
              placeholder="Password..."
            />
          </Form.Field>

          <Button onClick={onSubmit} type="submit">
            Register
          </Button>
        </Form>
      </div>
    );
  };

  const successMessage = () => {
    return (
      <div>
        <div
          style={{
            display: success ? "" : "none",
            width: "400px",
            margin: "auto",
          }}
        >
          <Message color="green">
            New account was created successfully, Please
            <Link to="/signin"> Login Here</Link>
          </Message>
        </div>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div>
        <div
          style={{
            display: error ? "" : "none",
            width: "400px",
            margin: "auto",
          }}
        >
          <Message color="red">{error}</Message>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Base title={"Register into the Network"}>
        {successMessage()}
        {errorMessage()}
        {signUpForm()}
      </Base>
    </div>
  );
};

export default Signup;
