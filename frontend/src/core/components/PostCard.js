import React from "react";
import { Button, Card, Grid, Image, Segment } from "semantic-ui-react";
import myImage from "../../img/green-bulb.png";

const PostCard = ({
  Prosumer_id = "1",
  Prosumer_Name = "BASUDEV",
  stakedEnergy = "2",
  uintPriceUSD = "0.001",
  unitPriceMatic = "0.001",
}) => {
  return (
    <Card fluid>
      <Card.Content>
        <Segment inverted color="green">
          <h3 style={{ textAlign: "center", color: "black" }}>
            {stakedEnergy} Units
            <span style={{ color: "red" }}> Energy For Sale</span>
          </h3>
        </Segment>
        <Image floated="right" size="small" src={myImage} />
        <Card.Header>Prosumer</Card.Header>
        <Card.Meta style={{ color: "darkblue" }}>
          <h4>
            Name: <span style={{ color: "brown" }}>{Prosumer_Name}</span>
          </h4>
        </Card.Meta>
        <Card.Meta style={{ color: "darkblue" }}>
          <h4>
            Prosumer ID: <span style={{ color: "black" }}>{Prosumer_id}</span>{" "}
          </h4>
        </Card.Meta>
        <Segment inverted style={{ width: "40%", padding: "5px" }}>
          <p>Unit Price (USD): ${uintPriceUSD}</p>
        </Segment>
        <Button color="orange" size="small">
          Buy Now
        </Button>{" "}
        <i style={{ color: "Red" }}>
          Note: You need to be a registered Prosumer
        </i>
      </Card.Content>
    </Card>
  );
};

export default PostCard;
