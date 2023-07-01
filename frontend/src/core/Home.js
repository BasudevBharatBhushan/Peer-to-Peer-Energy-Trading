import React from "react";
import Base from "./Base";
import { Link } from "react-router-dom";
import { Button, Segment, Image } from "semantic-ui-react";
import ViewAllCards from "./ViewAllCards";
import { isAuthenticated } from "../auth/helper";
import logo from "../img/logo.png";
import { INR_to_USD } from "./helper/priceConverter";

const Home = () => {
  return (
    <div>
      <Base title="One Step to the Green Future" TitleColour="green" />

      {isAuthenticated() ? (
        <>
          <Segment textAlign="center" inverted color="black">
            <h2>ENERGY MARKETPLACE</h2>
          </Segment>
          <ViewAllCards />
        </>
      ) : (
        <div>
          <Segment textAlign="center" inverted color="black">
            <h2>
              <span>
                <Link to="/signin">Login</Link>
              </span>{" "}
              to view the Energy Marketplace
            </h2>
          </Segment>
          <Image style={{ margin: "auto" }} size="huge" src={logo} />
          <h1>SignIn to view the Market Place</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
