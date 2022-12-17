import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import PendingTxnCard from "./components/PendingTxnCard";
import {
  Grid,
  Segment,
  Divider,
  Button,
  Header,
  Image,
} from "semantic-ui-react";
import txnImage from "../img/txn.png";
import { WriteContracts, ReadContracts } from "../blockchain/polygon";
import { LoaderAnimation } from "../core/components/LoaderAnimation";
import { serializeError } from "eth-rpc-errors";
import { isAuthenticated } from "../auth/helper/index";
import { useNavigate } from "react-router-dom";
import { Indexed } from "ethers/lib/utils";
import { createTxn } from "../core/helper/transactionHelper";

const _ = require("lodash");

const ViewAllPendingTxns = () => {
  const navigate = useNavigate();
  const { prosumer: owner } = isAuthenticated();
  const [loading, setLoading] = useState(false);

  const [txnValues, settxnValues] = useState({
    _producerAddress: "",
    _consumerAddress: "",
    _producerID: 0,
    _consumerID: 0,
    _produmerUnitPriceUSD: 0,
    _prosumerUnitPriceMatic: 0,
    _EnergyNeed: 0,
    _payablePrice: 0,
    _date: "",
  });

  const [obj, setObj] = useState([]);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      setDate();
      getAllPendingTransaction();
    }
  }, []);

  const setDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "/" + mm + "/" + yyyy;

    setTodayDate(formattedToday);
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

        obj.forEach((e) => {
          createTxn({
            txnDate: new Date(),
            producerID: parseInt(e._producerID.toString()),
            consumerID: parseInt(e._consumerID.toString()),
            producerAddress: e._producer,
            consumerAddress: e._consumer,
            tokensTransacted: parseInt(e._consumerEnergyNeed.toString()),
            maticsTransacted:
              parseInt(e._producerPaybleAmount.toString()) / 1e18,
            unitPriceUSD: parseInt(e._producerUnitPriceUSD.toString()) / 1e16,
            unitPriceMatic:
              parseInt(e._producerUnitPriceMATIC.toString()) / 1e18,
            transactionHash: ProcessTrade.hash,
          }).then((data) => {
            if (data.error) {
              alert(`Error: ${data.error}`);
            } else {
              setObj([]);
            }
          });
        });
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

  const getAllPendingTransaction = async () => {
    if (window.ethereum) {
      const GetAllPendingTransaction = await ReadContracts.getAllPendingTxn();
      console.log(GetAllPendingTransaction);
      setObj(GetAllPendingTransaction);
    }
  };

  return (
    <div>
      <Base title="Pending Transactions" />
      <Segment>
        <Grid columns={2} relaxed="very">
          <Grid.Column>
            <Grid columns={1} divided="vertically">
              <Grid.Row>
                <Grid.Column>
                  {obj &&
                    obj.map((txns, index) => {
                      return (
                        <PendingTxnCard
                          _transactionID={index}
                          _producerID={parseInt(txns._producerID.toString())}
                          _producerAddress={txns._producer}
                          _producerUnitPriceUSD={parseInt(
                            txns._producerUnitPriceUSD.toString()
                          )}
                          _producerUnitPriceMatic={parseInt(
                            txns._producerUnitPriceMATIC.toString()
                          )}
                          _consumerID={parseInt(txns._consumerID.toString())}
                          _consumerAddress={txns._consumer}
                          _energyNeed={parseInt(
                            txns._consumerEnergyNeed.toString()
                          )}
                          _payablePrice={parseInt(
                            txns._producerPaybleAmount.toString()
                          )}
                        />
                      );
                    })}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column>
            {!loading ? (
              <Segment style={{ position: "fixed" }} textAlign="center">
                <Header style={{ fontFamily: "Times New Roman" }} as="h1">
                  PEER-TO-PEER TRADE
                </Header>
                <Image src={txnImage} />
                <Button onClick={processTrade} fluid size="massive" color="red">
                  Execute All Transactions
                </Button>
              </Segment>
            ) : (
              LoaderAnimation()
            )}
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  );
};
export default ViewAllPendingTxns;
