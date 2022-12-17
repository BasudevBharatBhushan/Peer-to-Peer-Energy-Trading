import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Base from "../core/Base";
import ViewAllUnapprovedProsumers from "./ViewAllUnapprovedProsumers";
import ViewAllApprovedProsumers from "./ViewAllApprovedProsumers";
import { serializeError } from "eth-rpc-errors";
import { Grid, Segment, Button, Form, Header, Input } from "semantic-ui-react";
import { isAuthenticated } from "../auth/helper/index";
import { ReadContracts, WriteContracts } from "../blockchain/polygon";
import { LoaderAnimation } from "../core/components/LoaderAnimation";
import { createTxn, getAllTransaction } from "./helper/transactionapicall";
import { useNavigate } from "react-router-dom";

const _ = require("lodash");

const EscrowDashboard = () => {
  const navigate = useNavigate();
  const { prosumer: owner } = isAuthenticated();
  const [escrow_balance, setEscrow_balance] = useState({
    MaticBalance: undefined,
    EnergyBalance: undefined,
    RegFee: undefined,
  });

  const [transactionValues, setTransactionValues] = useState({
    _producer: "",
    _consumer: "",
    _producerID: "",
    _consumerID: "",
    _consumerEnergyNeed: "",
    _producerUnitPrice: "",
    // _producerUnitPriceUSD  TODO:
    _producerPaybleAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [registrationFee, setRegistrationFee] = useState();
  useEffect(() => {
    if (window.ethereum) {
      escrowProfile();
      pendingTxn();
    }
  }, []);

  const pendingTxn = async () => {
    if (window.ethereum) {
      const PendingTxn = await ReadContracts.Transaction(0);
      console.log(PendingTxn);

      // setTransactionValues({
      //   _producer: PendingTxn._producer,
      //   _consumer: PendingTxn._consumer,
      //   _producerID: PendingTxn._producerID.toString(),
      //   _consumerID: PendingTxn._consumerID.toString(),
      //   _consumerEnergyNeed: PendingTxn._consumerEnergyNeed.toString(),
      //   _producerUnitPrice: PendingTxn._producerUnitPrice.toString(),
      //   // _producerUnitPriceUSD  TODO:
      //   _producerPaybleAmount: PendingTxn._producerPaybleAmount.toString(),
      // });
    }
    // console.log(transactionValues);
  };

  const escrowProfile = async () => {
    if (window.ethereum) {
      try {
        const EscrowBalance = await ReadContracts.viewEscrowBalance();
        const regFee = await ReadContracts.regFee();
        setEscrow_balance({
          MaticBalance: Number(EscrowBalance[0]),
          EnergyBalance: Number(EscrowBalance[1]),
          RegFee: Number(regFee) / 1e18,
        });

        console.log(escrow_balance);
        console.log(regFee);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const setRegFee = async () => {
    if (
      window.ethereum &&
      window.ethereum.selectedAddress === _.toLower(owner.publicAddress)
    ) {
      try {
        setLoading(true);
        const RegFeeWei = registrationFee * 1e18;
        console.log(RegFeeWei);
        const SetRegFee = await WriteContracts.setRegFee(
          BigNumber.from(RegFeeWei)
        );
        await SetRegFee.wait(1);
        setLoading(false);
        alert(`Registration Fee Set \n
        Txn Hash: ${SetRegFee.hash}
        `);
      } catch (error) {
        const serializedError = serializeError(error);
        alert(`Error: ${serializedError.data.originalError.reason}`);
        console.log(serializedError.data.originalError.reason);
        setLoading(false);
      }
    } else {
      alert(`Please Connect the Wallet with your Registered Address \n
      ${owner.publicAddress}
      `);
    }
  };

  const withdrawFee = async () => {
    if (
      window.ethereum &&
      window.ethereum.selectedAddress === _.toLower(owner.publicAddress)
    ) {
      try {
        setLoading(true);
        const WithdrawFee = await WriteContracts.withdrawFees();
        await WithdrawFee.wait(1);

        setLoading(false);
        alert(`Fees Successfully withdrawn to every owners Wallet \n
        Txn Hash: ${WithdrawFee.hash}
        `);
      } catch (error) {
        setLoading(false);
        const serializedError = serializeError(error);
        alert(`Error: ${serializedError.data.originalError.reason}`);
        console.log(serializedError.data.originalError.reason);
      }
    } else {
      alert(`Please Connect the Wallet with your Registered Address \n
      ${owner.publicAddress}
      `);
    }
  };

  const processTrade = async () => {
    if (
      window.ethereum &&
      window.ethereum.selectedAddress === _.toLower(owner.publicAddress)
    ) {
      try {
        setLoading(true);
        const ProcessTrade = await WriteContracts.processTrade();

        await ProcessTrade.wait(1);
        setLoading(false);
        alert(`All Trades are Executed \n
        Txn Hash: ${ProcessTrade.hash}
        `);
      } catch (error) {
        setLoading(false);
        const serializedError = serializeError(error);
        alert(`Error: ${serializedError.data.originalError.reason}`);
        console.log(serializedError.data.originalError.reason);
      }
    } else {
      alert(`Please Connect the Wallet with your Registered Address \n
      ${owner.publicAddress}
      `);
    }
  };

  return (
    <div>
      <Base title="Escrow Dashboard" TitleColour="red" />
      <Segment textAlign="center" inverted>
        <Grid columns={3} relaxed="very">
          <Grid.Column>
            <h4>Owner Id: {owner.role}</h4>
          </Grid.Column>
          <Grid.Column>
            <h4>Name: {owner.name}</h4>
          </Grid.Column>
          <Grid.Column>
            <h4>Address: {owner.publicAddress}</h4>
          </Grid.Column>
        </Grid>
      </Segment>
      {!loading ? (
        <Segment>
          <Grid columns={3} divided>
            <Grid.Column>
              <ViewAllUnapprovedProsumers />
            </Grid.Column>
            <Grid.Column>
              <ViewAllApprovedProsumers />
            </Grid.Column>
            <Grid.Column>
              <Segment inverted color="">
                <Header as="h3">Escrow Profile</Header>
                <li>Current Reg. Fee : {escrow_balance.RegFee} Matic</li>
                <li>
                  Matic Balance :{escrow_balance.MaticBalance / 1e18} Matic{" "}
                </li>
                <li>Energy Balance :{escrow_balance.EnergyBalance} Unit</li>
              </Segment>
              <Form>
                <Header as="h2" color="brown">
                  Escrow Functions
                </Header>
                <Form.Field inline>
                  <Button onClick={setRegFee} color="orange">
                    Set Reg Fee
                  </Button>
                  <Input
                    placeholder="Reg Fee for users (Matic)"
                    onChange={(e) => {
                      setRegistrationFee(e.target.value);
                    }}
                  />
                </Form.Field>
                <Button onClick={withdrawFee} color="teal">
                  Witdhraw Fees
                </Button>
              </Form>
              <Segment>
                <Button
                  color="red"
                  fluid
                  size="massive"
                  onClick={() => {
                    navigate("/escrow/pendingtransactions");
                  }}
                >
                  View Pending Transactions
                </Button>
              </Segment>
            </Grid.Column>
          </Grid>

          {/* <Divider vertical>And</Divider> */}
        </Segment>
      ) : (
        LoaderAnimation()
      )}
    </div>
  );
};

export default EscrowDashboard;
