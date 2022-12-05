import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import {
  Checkbox,
  Segment,
  Grid,
  Form,
  Button,
  Divider,
  Header,
  Image,
  Table,
  List,
  Input,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import PostCard from "../core/components/PostCard";

const ProsumerDashboard = ({
  ProsumerName = "Basudev",
  ProsumerID = "2",
  PublicAddress = "0x85b3dB26424a88e7C1319E40a6324d64Acf1fFA2",
  EnergyBalance = "2",
  MaticBalance = "10",
}) => {
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState({
    num: 1,
    message: "PROSUMER MODE",
    stateMessage: "CONSUMER MODE",
  });

  const { num, message, stateMessage } = toggleState;

  const [component, setComponent] = useState();

  useEffect(() => {
    if (num == 1) {
      setComponent(ConsumerForm);
    } else {
      setComponent(ProsumerForm);
    }
  });

  const ProsumerForm = () => {
    return (
      <div>
        <Base title="Prosumer Dashboard" TitleColour="blue" />
      </div>
    );
  };

  const ConsumerForm = () => {
    return (
      <div>
        <Base title="Consumer Dashboard" TitleColour="grey" />
      </div>
    );
  };

  const handleToggleTrigger = () => {
    if (num === 1) {
      setToggleState({
        num: 2,
        message: "CONSUMER MODE",
        stateMessage: "PROSUMER MODE",
      });
    } else {
      setToggleState({
        num: 1,
        message: "PROSUMER MODE",
        stateMessage: "CONSUMER MODE",
      });
    }
  };

  const consumerForm = () => {
    return (
      <>
        <Segment>
          <Grid columns={3}>
            <Grid.Column textAlign="center">
              <Segment>
                <Form>
                  <Header as="h2">Energy Factory</Header>
                  <Form.Field inline>
                    <label>Produce Energy</label>
                    <Input placeholder="Unit of Energy" onChange={""} />
                    <Button positive onClick={""}>
                      Mint
                    </Button>
                    <p>Mint Message</p>
                  </Form.Field>
                  <Form.Field inline>
                    <label>Burn Energy</label>
                    <Input placeholder="Unit of Energy" onChange={""} />
                    <Button color="red" onClick={""}>
                      Burn
                    </Button>
                    <p>Burn Message</p>
                  </Form.Field>
                </Form>
              </Segment>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Segment>
                <Segment inverted>Listing</Segment>
                <h3>Stacked Energy: 3</h3>
                <b>Price(USD): $3</b>
              </Segment>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Segment>
                <Form>
                  <Header as="h2" color="brown">
                    List Your Energy
                  </Header>
                  <Form.Field inline>
                    <label>Energy Unit </label>
                    <Input
                      placeholder="Unit of Energy for Listing"
                      onChange={""}
                    />
                  </Form.Field>
                  <Form.Field inline>
                    <label>Price(USD) </label>
                    <Input placeholder="Price for 1 Unit" onChange={""} />
                  </Form.Field>
                  <Button color="blue" onClick={""}>
                    List
                  </Button>
                </Form>
              </Segment>
            </Grid.Column>
          </Grid>
        </Segment>
      </>
    );
  };

  return (
    <>
      {/*------------------- TOGGLE------------------------------------------------------------------- */}
      {component}

      <Segment compact style={{ display: "inline" }}>
        <b>
          SWITCH TO<span style={{ color: "teal" }}> {message}</span>
        </b>
      </Segment>
      <Segment compact style={{ display: "inline" }}>
        <Checkbox
          toggle
          onChange={() => {
            {
              console.log("Toggle Triggered");
              handleToggleTrigger();
            }
          }}
        />
      </Segment>

      {/*-------------------PROFILE------------------------------------------------------------------------ */}
      <Segment>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
            <Segment
              inverted
              compact
              style={{
                display: "inline",
                marginRight: "10px",
              }}
            >
              <b>Name: {ProsumerName}</b>
            </Segment>
            <Segment
              inverted
              compact
              color="brown"
              style={{ display: "inline" }}
            >
              <b>Prosumer Id: {ProsumerID}</b>
            </Segment>

            <Segment inverted compact color="blue" style={{ marginTop: "4%" }}>
              <b>Public Key: {PublicAddress}</b>
            </Segment>
          </Grid.Column>

          <Grid.Column verticalAlign="middle">
            <Header color="blue" size="big" textAlign="center">
              BALANCE
            </Header>
            <Segment
              inverted
              color="grey"
              style={{ width: "30%", margin: "auto" }}
            >
              <h4>
                Energy :
                <span style={{ color: "yellow" }}> {EnergyBalance} units</span>
              </h4>
              <b>
                Matic :
                <span style={{ color: "yellow" }}> {MaticBalance} coins</span>
              </b>
            </Segment>
          </Grid.Column>
        </Grid>

        <Divider vertical>{stateMessage}</Divider>
      </Segment>
      {/*-------------------PROSUMER MODE------------------------------------------------------------------------ */}

      {num === 2 && consumerForm()}

      {/*-------------------ENERGY TRANSACTION------------------------------------------------------------------------ */}

      <Segment>
        <Table inverted>
          <Table.Header>
            <Table.HeaderCell colSpan="7">ENERGY TRANSACTIONS</Table.HeaderCell>
            <Table.Row>
              <Table.HeaderCell textAlign="center">Date</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Sold/Buy</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                To/From [Id]
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Credit/Debit
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Energy</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Unit Price [$]
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Txn. Hash</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell textAlign="center">John</Table.Cell>
              <Table.Cell textAlign="center" style={{ background: "green" }}>
                Buy
              </Table.Cell>
              <Table.Cell textAlign="center">1</Table.Cell>
              <Table.Cell textAlign="center">Credit</Table.Cell>

              <Table.Cell textAlign="center">2</Table.Cell>

              <Table.Cell textAlign="center">0.001</Table.Cell>
              <Table.Cell textAlign="center">OX...</Table.Cell>
            </Table.Row>
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="3">
                Total Sold: <span style={{ color: "yellow" }}>30</span>
              </Table.HeaderCell>

              <Table.HeaderCell colSpan="3">
                Total Bought: <span style={{ color: "yellow" }}>10</span>{" "}
              </Table.HeaderCell>

              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>
    </>
  );
};

export default ProsumerDashboard;
