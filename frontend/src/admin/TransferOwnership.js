import React from "react";
import Base from "../core/Base";
import { useNavigate } from "react-router-dom";
import { Segment, Header, Icon, Button } from "semantic-ui-react";

const TransferOwnership = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Base title="Danger Zone" TitleColour="red" />
      <Segment textAlign="center">
        <Icon name="warning sign" color="red" size="massive" />
        <Header size="huge">This Process is Irreversible</Header>
      </Segment>
      <Segment style={{ margin: "auto" }} inverted color="red" compact>
        <Header size="huge">
          <a
            style={{ color: "black" }}
            target="._blank"
            href="https://mumbai.polygonscan.com/address/0x8405530272edF14FB5F9671fc25d3efC16a8B5D4#writeContract#F18"
          >
            TRANSFER OWNERSHIP
          </a>
        </Header>
      </Segment>
      <Button
        color="teal"
        onClick={() => {
          navigate("/");
        }}
        style={{ marginLeft: "47%", marginTop: "60px" }}
      >
        Home
      </Button>
    </div>
  );
};

export default TransferOwnership;
