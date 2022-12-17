import React from "react";
import { Card, List, Grid, Segment } from "semantic-ui-react";

const PendingTxnCard = ({
  _transactionID = 1,
  _producerID = 1,
  _producerAddress = "0x134...",
  _producerUnitPriceUSD = 1,
  _producerUnitPriceMatic = 1,
  _consumerID = 2,
  _consumerAddress = "0xer45...",
  _energyNeed = 1,
  _payablePrice = 1,
}) => {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>TXN ID: {_transactionID + 1}</Card.Header>
        <Segment>
          <Grid columns={2} relaxed="very">
            <Grid.Column>
              <List bulleted>
                <List.Item>
                  <b style={{ color: "brown" }}>PRODUCER</b>
                  <List.List>
                    <List.Item>Prosumer ID: {_producerID}</List.Item>
                    <List.Item>
                      Address: {_producerAddress.substring(0, 12) + "..."}
                    </List.Item>
                    <List.Item>
                      UnitPrice (USD): {_producerUnitPriceUSD / 1e16}
                    </List.Item>
                    <List.Item>
                      UnitPrice (MATIC): {_producerUnitPriceMatic / 1e18}
                    </List.Item>
                  </List.List>
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column>
              <List bulleted>
                <List.Item>
                  <b style={{ color: "blue" }}> CONSUMER</b>

                  <List.List>
                    <List.Item>Prosumer ID: {_consumerID}</List.Item>
                    <List.Item>
                      Address: {_consumerAddress.substring(0, 12) + "..."}
                    </List.Item>
                    <List.Item>Energy Need: {_energyNeed}</List.Item>
                    <List.Item>Payable Price: {_payablePrice / 1e18}</List.Item>
                  </List.List>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid>
        </Segment>
      </Card.Content>
    </Card>
  );
};

export default PendingTxnCard;
