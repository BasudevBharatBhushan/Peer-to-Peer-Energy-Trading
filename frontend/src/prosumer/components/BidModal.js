import React, { useState, useEffect } from "react";
import {
  Modal,
  Header,
  Form,
  Segment,
  Button,
  Message,
} from "semantic-ui-react";
import { LoaderAnimation } from "../../core/components/LoaderAnimation";
import { ReadContracts, WriteContracts } from "../../blockchain/polygon";
import { serializeError } from "eth-rpc-errors";
import { ethers, BigNumber } from "ethers";
import { isAuthenticated } from "../../auth/helper";
import { updateCard, deleteCard } from "../../core/helper/cardHelper";
import { useNavigate } from "react-router-dom";
import MyPopup from "../../util/MyPopup";
const _ = require("lodash");

const BidModal = ({
  prosumerID,
  unitPriceUSD,
  unitPriceMatic,
  stakedEnergy,
  cardID,
}) => {
  const navigate = useNavigate();
  const { prosumer } = isAuthenticated();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [gasPrice, setGasPrice] = useState(0);
  // const [cardValues, setCardValues] = useState({
  //   stakedEnergy:stakedEnergy
  // })

  const onSucessfullBid = async () => {
    if (inputValue == stakedEnergy) {
      //-- Delete Card
      deleteCard(cardID);
    } else {
      //-- Update Card
      updateCard(cardID, { stakedEnergy: stakedEnergy - inputValue });
    }
  };

  const bid = async () => {
    if (
      window.ethereum &&
      window.ethereum.selectedAddress === _.toLower(prosumer.publicAddress)
    ) {
      try {
        setLoading(true);

        let inputWei = unitPriceMatic * inputValue;

        const inputMatic = inputWei.toString();

        await WriteContracts.estimateGas
          .bid(BigNumber.from(prosumerID), BigNumber.from(inputValue), {
            value: ethers.utils.parseEther(inputMatic),
            gasLimit: 500000,
          })
          .then((data) => {
            console.log(data.toString());
            setGasPrice(parseInt(data.toString()) << 1);
          });
        console.log(gasPrice);
        const Bid = await WriteContracts.bid(
          BigNumber.from(prosumerID),
          BigNumber.from(inputValue),
          {
            value: ethers.utils.parseEther(inputMatic),
            gasLimit: gasPrice,
          }
        );

        await Bid.wait(1);
        setLoading(false);
        alert(`Bidding Sucessful \n
        Txn Hash: ${Bid.hash}
        `);
        onSucessfullBid();
        console.log("ok it is reaching to this point");
      } catch (error) {
        setLoading(false);
        const serializedError = serializeError(error);
        alert(`Error: ${serializedError.data.originalError.reason}`);
        console.log(serializedError);
      }
    } else {
      alert(`Please Connect the Wallet with your Registered Address \n
      ${prosumer.publicAddress}
      `);
    }
  };

  return (
    <>
      {!loading ? (
        <Modal.Description>
          <Segment inverted>
            <Form inverted>
              <Form.Group widths="equal">
              <MyPopup content={"Enter the KW of Energy you want to purchase"} position="right center" size="small">
              <Form.Input
                  label="Energy Needs"
                  placeholder="KW of Energy"
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                />
              </MyPopup>
                
              </Form.Group>
              <Message floating>
                <Message.Header>Payable Price:</Message.Header>
                <p style={{ marginBottom: "0" }}>
                  Matic: {unitPriceMatic * inputValue} coin
                </p>
                <p style={{ marginTop: "0" }}>
                  USD: $ {unitPriceUSD * inputValue}
                </p>
              </Message>
              <MyPopup content={"Place Order"} position="center">
              <Button type="submit" color="orange" onClick={bid}>
                Bid
              </Button>
              </MyPopup>
             
            </Form>
          </Segment>
        </Modal.Description>
      ) : (
        LoaderAnimation()
      )}
    </>
  );
};

export default BidModal;
