import React, { useState } from "react";
import {
  Button,
  Card,
  Grid,
  Image,
  Segment,
  Modal,
  Header,
} from "semantic-ui-react";
import myImage from "../../img/green-bulb.png";
import thankyou from "../../img/Thankyou.png";
import BidModal from "../../prosumer/components/BidModal";

const PostCard = ({
  Prosumer_id = "1",
  Prosumer_Name = "BASUDEV",
  stakedEnergy = "2",
  uintPriceUSD = "0.001",
  unitPriceMatic = "0.001",
  cardID,
}) => {
  const [open, setOpen] = React.useState(false);

  const ModalForm = () => {
    return (
      <Modal
        size="tiny"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button color="orange" size="small">
            Buy Now
          </Button>
        }
      >
        <Modal.Header>
          BID FOR ENERGY |
          <span style={{ color: "brown" }}> Prosumer ID: {"2"}</span>
        </Modal.Header>
        <Modal.Content image>
          <Image size="medium" src={thankyou} wrapped />
          <BidModal
            prosumerID={Prosumer_id}
            unitPriceUSD={uintPriceUSD}
            unitPriceMatic={unitPriceMatic}
            stakedEnergy={stakedEnergy}
            cardID={cardID}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

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
            Prosumer ID: <span style={{ color: "black" }}>{Prosumer_id}</span>
          </h4>
        </Card.Meta>
        <Segment
          inverted
          style={{ width: "40%", padding: "5px", display: "inline-block" }}
        >
          <p>Unit Price (USD): ${uintPriceUSD}</p>
        </Segment>
        <p>≈ {unitPriceMatic} Matic</p>

        {/* <ModalForm /> */}
        {ModalForm()}
        <i style={{ color: "Red" }}>
          Note: You need to be a registered Prosumer
        </i>
      </Card.Content>
    </Card>
  );
};

export default PostCard;
