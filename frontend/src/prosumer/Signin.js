import "../App.css";
import React, { useState } from "react";
import Base from "../core/Base";
import { Navigate } from "react-router-dom";
import { signin, isAuthenticated, authenticate } from "../auth/helper";
import {
  Button,
  Form,
  Message,
  Segment,
  Dimmer,
  Loader,
} from "semantic-ui-react";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    didRedirect: false,
  });

  const { email, password, error, didRedirect, loading } = values;

  const { prosumer } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            setValues({ ...values, didRedirect: true });
          });
        }
      })
      .catch(console.log("Signin request failed"));
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (prosumer && prosumer.role === 1) {
        console.log(prosumer);
        return <Navigate to="/" />;
      } else {
        return <Navigate to="/" />;
      }
    }
    if (isAuthenticated()) {
      return <Navigate replace to="/" />;
    }
  };

  const signInForm = () => {
    return (
      <div className="form-container">
        <Form>
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
            Submit
          </Button>
        </Form>
      </div>
    );
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div>
          <Segment>
            <Dimmer active>
              <Loader size="massive">Loading</Loader>
            </Dimmer>
          </Segment>
        </div>
      )
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
      <Base title={"Login"}>
        {loadingMessage()}
        {errorMessage()}
        {signInForm()}
        {performRedirect()}
      </Base>
    </div>
  );
};

export default Signin;
