import { useNavigate } from "react-router-dom";
import React, { Fragment, useState } from "react";
import { Button, Menu, Segment, Header } from "semantic-ui-react";
import { signout, isAuthenticated } from "../auth/helper";

const NavBar = ({ title = "TITLE GOES HERE", TitleColour = "black" }) => {
  const navigate = useNavigate();
  const [navState, setNavState] = useState();

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

      <Menu.Item>
        <Segment
          inverted
          style={{
            padding: "7px",
            position: "fixed",
            marginBottom: "15px",
            background: `${TitleColour}`,
          }}
        >
          <b>{title}</b>
        </Segment>
      </Menu.Item>

      {/* <Segment size="mini">Title</Segment> */}

      <Menu.Menu position="right">
        <Menu.Item
          name="About"
          onClick={() => {
            navigate("/About");
          }}
        />
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
