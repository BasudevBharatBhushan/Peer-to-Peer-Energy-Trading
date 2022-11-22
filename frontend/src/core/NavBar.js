import { useNavigate } from "react-router-dom";
import React, { Fragment, useState } from "react";
import { Button, Menu } from "semantic-ui-react";
import { signout, isAuthenticated } from "../auth/helper";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Menu className="Navbar" pointing secondary>
      <Menu.Item
        name="Home"
        onClick={() => {
          navigate("/");
        }}
      />

      {isAuthenticated() && isAuthenticated().prosumer.role === 1 && (
        <Menu.Item
          name="Escrow Dashboard"
          onClick={() => {
            navigate("/escrow/dashboard");
          }}
        />
      )}

      {isAuthenticated() && isAuthenticated().prosumer.role === 0 && (
        <Menu.Item
          name="Dashboard"
          onClick={() => {
            navigate("/prosumer/dashboard");
          }}
        />
      )}
      <Menu.Item
        name="About"
        onClick={() => {
          navigate("/About");
        }}
      />
      <Menu.Menu position="right">
        {!isAuthenticated() && (
          <Fragment>
            <Menu.Item
              name="Signup"
              onClick={() => {
                navigate("/signup");
              }}
            />
            <Menu.Item
              name="Signin"
              onClick={() => {
                navigate("/signin");
              }}
            />
          </Fragment>
        )}

        {isAuthenticated() && (
          <Menu.Item
            name="Signout"
            onClick={() => {
              signout(() => {
                navigate("/");
              });
            }}
          />
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default NavBar;
