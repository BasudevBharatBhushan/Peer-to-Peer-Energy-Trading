import React, { useState, useEffect } from "react";
import { Button, Card } from "semantic-ui-react";

const ApprovedProsumerCard = ({
  _prosumerAadhar = "334535477102",
  _prosumerAddress = "0xFCf4BE15b7E65D6aAC2255C8d4160E3b78c0261b",
  _prosumerID = "0",
  _email = "sample@gmail.com",
  _name,
}) => {
  return (
    <div>
      <Card fluid>
        <Card.Content>
          <Card.Header style={{ color: "blue" }}>
            Prosumer ID: {_prosumerID}
          </Card.Header>
          <Card.Description>
            <span>
              <b>Name: </b>
            </span>
            {_name}
          </Card.Description>
          <Card.Description>
            <span>
              <b>Address: </b>
            </span>
            {_prosumerAddress}
          </Card.Description>
          <Card.Description>
            <span>
              <b>Aadhar Id: </b>
            </span>
            {_prosumerAadhar}
          </Card.Description>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ApprovedProsumerCard;
