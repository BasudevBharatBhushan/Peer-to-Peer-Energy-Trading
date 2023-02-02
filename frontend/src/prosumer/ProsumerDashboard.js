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
  Message,
} from "semantic-ui-react";
import { ethers, BigNumber } from "ethers";
import { useNavigate } from "react-router-dom";
import { createCard, updateCard, deleteCard } from "../core/helper/cardHelper";
import { isAuthenticated } from "../auth/helper";
import { API } from "../backend";
import { WriteContracts, ReadContracts } from "../blockchain/polygon";
import { serializeError } from "eth-rpc-errors";
import { LoaderAnimation } from "../core/components/LoaderAnimation";
import { getTxns } from "../core/helper/transactionHelper";
const _ = require("lodash");

const ProsumerDashboard = () => {
  const navigate = useNavigate();
  const [toggleState, setToggleState] = useState({
    num: 1,
    message: "PROSUMER MODE",
    stateMessage: "CONSUMER MODE",
  });

  const { prosumer, token } = isAuthenticated();

  const { num, message, stateMessage } = toggleState;

  const [component, setComponent] = useState();

  const [cards, setCards] = useState([]);

  const [executeList, setExecuteList] = useState(true);

  const [tnc, setTnc] = useState(false);

  const [queryProsumerID, setQueryProsumerID] = useState(0);

  const [regFee, setRegFee] = useState(0);

  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [mintLoading, setMintLoading] = useState(false);

  const [aadhar, setAadhar] = useState(0);

  const [mintEnergy, setMintEnergy] = useState();

  const [burnEnergy, setBurnEnergy] = useState();

  const [txns, setTxns] = useState([]);

  const [txnCounter, setTxnCounter] = useState();

  const [balance, setBalance] = useState({
    energyTokenBalance: 0,
    maticCoinBalance: 0,
  });

  const [contractProsumer, setContractProsumer] = useState({
    _prosumerID: 0,
    _energyUnitPriceUSD: 0,
    _energyUnitPriceMatic: 0,
    _stakedEnergyBalance: 0,
    _aadharId: 0,
  });

  const [cardId, setCardId] = useState({
    stakedEnergy: 0,
    unitPriceUSD: 0,
  });

  const [values, setValues] = useState({
    listProsumer: prosumer,
    prosumerID: contractProsumer._prosumerID,
    name: prosumer.name,
    unitPriceUSD: 0,
    unitPriceMatic: 0,
    stakedEnergy: 0,
    error: "",
    success: false,
  });

  const {
    listProsumer,
    prosumerID,
    name,
    unitPriceUSD,
    unitPriceMatic,
    stakedEnergy,
    error,
    success,
  } = values;

  useEffect(() => {
    if (num == 1) {
      setComponent(ConsumerForm);
    } else {
      setComponent(ProsumerForm);
    }
    // queryProsumer();
    getAllCard();
    prosumerIDQuery();
    prosumerBalance();
    getAllTxns();
  }, []);

  const getAllCard = async () => {
    await fetch(`${API}/card/all`)
      .then((response) => response.json())
      .then((data) => {
        console.log(cards);
        setCards(data);
      });
  };

  const getAllTxns = () => {
    const GetAllTxns = getTxns()
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTxns(data);
      });
    console.log(txns);
  };

  // const getTxnsCount = () => {   //TODO: Feature to be implemented in Future, unable to figure out its waiting and printing state
  //   if (txns) {
  //     console.log("getTxnsCount Triggered");
  //     const GetTxnsCount = txns.filter(
  //       (e) =>
  //         e.producerID === parseInt(contractProsumer._prosumerID.toString()) ||
  //         e.consumerID === parseInt(contractProsumer._prosumerID.toString())
  //     );

  //     setTxnCounter(GetTxnsCount.length);
  //   } else {
  //     setTimeout(getTxnsCount, 300);
  //   }
  //   console.log(txnCounter);
  // };

  const updateMaticCard = async (id) => {
    if (window.ethereum) {
      let x = parseInt(contractProsumer._prosumerID.toString()) - 1;

      const GetProsumer = await ReadContracts.ApprovedProsumers(x);

      updateCard(id, {
        unitPriceMatic:
          parseInt(GetProsumer._energyUnitPriceMatic.toString()) / 1e18,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
    }
  };

  /*--------------------------SMART CONTRACT FUNCTIONS----------------------------*/

  //--> Reg Registration
  const reqReg = async () => {
    if (
      window.ethereum &&
      window.ethereum.selectedAddress === _.toLower(prosumer.publicAddress)
    ) {
      try {
        setLoading(true);
        let inputRegFee = regFee.toString();
        const ReqReg = await WriteContracts.req_Registration(
          BigNumber.from(aadhar),
          { value: ethers.utils.parseEther(inputRegFee) }
        );
        await ReqReg.wait(1);
        setLoading(false);
        alert(`Registration Requested \n
        Txn Hash: ${ReqReg.hash}
        `);
      } catch (error) {
        setLoading(false);
        const serializedError = serializeError(error);
        alert(`Error: ${serializedError.data.originalError.reason}`);
        console.log(serializedError.data.originalError.reason);
      }
    } else {
      alert(`Please Connect the Wallet with your Registered Address \n
      ${prosumer.publicAddress}
      `);
    }
  };

  //--> Mint Function
  const mint = async () => {
    if (
      window.ethereum &&
      window.ethereum.selectedAddress === _.toLower(prosumer.publicAddress)
    ) {
      try {
        setMintLoading(true);
        const Mint = await WriteContracts.produceEnergy(
          BigNumber.from(mintEnergy, { gasLimit: 40000 })
        );
        await Mint.wait(1);
        alert(`Energy Produced \n
        Txn Hash: ${Mint.hash}
        `);
        setMintLoading(false);
        setMintEnergy();
      } catch (error) {
        setMintLoading(false);
        const serializedError = serializeError(error);
        alert(`Error: ${serializedError.data.originalError.reason}`);
        console.log(serializedError.data.originalError.reason);
      }
    } else {
      alert(`Please Connect the Wallet with your Registered Address \n
      ${prosumer.publicAddress}
      `);
    }
  };

  //--> Burn Function

  const burn = async () => {
    if (
      window.ethereum &&
      window.ethereum.selectedAddress === _.toLower(prosumer.publicAddress)
    ) {
      try {
        setMintLoading(true);
        const Burn = await WriteContracts.burnEnergy(
          BigNumber.from(burnEnergy)
        );
        await Burn.wait(1);
        setMintLoading(false);
        setBurnEnergy();
        alert(`Energy Burned \n
        Txn Hash: ${Burn.hash}
        `);
      } catch (error) {
        setMintLoading(false);
        const serializedError = serializeError(error);
        alert(`Error: ${serializedError.data.originalError.reason}`);
        console.log(serializedError.data.originalError.reason);
      }
    } else {
      alert(`Please Connect the Wallet with your Registered Address \n
      ${prosumer.publicAddress}
      `);
    }
  };

  //--> Advert

  const advert = async (id) => {
    //advert = advertise energy (couldn't come up with better name)
    if (
      window.ethereum &&
      window.ethereum.selectedAddress === _.toLower(prosumer.publicAddress)
    ) {
      try {
        setListLoading(true);
        const inputPrice = 1e16 * unitPriceUSD;
        const Advert = await WriteContracts.advert(
          BigNumber.from(inputPrice),
          BigNumber.from(stakedEnergy)
        );
        await Advert.wait(1);
        setListLoading(false);
        alert(`Energy Listed Successfully \n
        Txn Hash: ${Advert.hash}
        `);

        navigate("/");
      } catch (error) {
        setListLoading(false);
        deleteCard(id);
        const serializedError = serializeError(error);
        alert(`Error: ${serializedError.data.originalError.reason}`);
        console.log(serializedError.data.originalError.reason);
      }
    } else {
      alert(`Please Connect the Wallet with your Registered Address \n
      ${prosumer.publicAddress}
      `);
    }
  };

  //--> Approved Prosumer Query Function (staked energy and unit price of energy)

  const queryProsumer = async () => {
    console.log("Atleast reaching here");
    if (window.ethereum) {
      console.log("queryProsumer Triggered");
      const ProsumerIDQuery = await ReadContracts.prosumerID(
        prosumer.publicAddress
      );
      const input = ProsumerIDQuery - 1;
      const QueryProsumer = await ReadContracts.ApprovedProsumers(input);

      console.log(QueryProsumer);
      setContractProsumer({
        _prosumerID: QueryProsumer._prosumerID,
        _energyUnitPriceUSD: QueryProsumer._energyUnitPriceUSD,
        _energyUnitPriceMatic: QueryProsumer._energyUnitPriceMatic,
        _stakedEnergyBalance: QueryProsumer._stakedEnergyBalance,
        _aadharId: QueryProsumer._aadharId,
      });

      console.log(contractProsumer);
    }
  };

  //--> Prosumer ID query

  const prosumerIDQuery = async () => {
    if (window.ethereum) {
      const ProsumerIDQuery = await ReadContracts.prosumerID(
        prosumer.publicAddress
      );
      const RegFee = await ReadContracts.regFee();

      setQueryProsumerID(ProsumerIDQuery);
      setRegFee(RegFee / 1e18);
      if (ProsumerIDQuery > 0) {
        queryProsumer();
      }
    }
  };

  //--> Energy Balance Query
  const prosumerBalance = async () => {
    if (window.ethereum) {
      const EnergyTokenBalance = await WriteContracts.viewEnergyBalance();
      const MaticCoinBalance = await WriteContracts.viewMaticBalance();

      setBalance({
        energyTokenBalance: EnergyTokenBalance,
        maticCoinBalance: MaticCoinBalance / 1e18,
      });
    }
  };

  /*-------------------------------------------------------------------------------*/

  const onListChange = (name) => (event) => {
    setValues({
      ...values,
      prosumerID: parseInt(contractProsumer._prosumerID.toString()),
      error: false,
      [name]: event.target.value,
    });
  };

  const onList = (event) => {
    // event.preventDefault();
    console.log(cards);

    cards.map((e) => {
      if (e.listProsumer === prosumer._id) {
        console.log("hello there");
        setExecuteList(false);

        return;
      }
    });

    if (executeList) {
      setValues({ ...values, listProsumer: prosumer, error: false });
      console.log(listProsumer);

      createCard(prosumer, token, {
        listProsumer,
        prosumerID,
        name,
        unitPriceUSD,
        unitPriceMatic,
        stakedEnergy,
      })
        .then((response) => response.json())

        .then((data) => {
          if (data.error) {
            setValues({ ...values, error: data.error, success: false });
            alert("You have already Listed Energy");
          } else {
            advert(data._id);
            console.log(data._id);
            updateMaticCard(data._id);
            setValues({
              ...values,
              success: true,
            });
          }
        });
    } else {
      alert("You Have already Listed your Energy");
    }
  };

  const ReqRegistrationForm = () => {
    return (
      <>
        {!loading ? (
          <div className="form-container">
            <Segment inverted>
              <Header>Request for Registration</Header>
              <Form inverted>
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    label="Aadhar ID"
                    placeholder="12 Digit Aadhar ID"
                    onChange={(e) => {
                      setAadhar(e.target.value);
                    }}
                  />
                </Form.Group>
                <Message negative>
                  <p>** Registration Fee: {regFee} Matic</p>
                </Message>
                <Form.Checkbox
                  onChange={(e) => {
                    if (tnc) {
                      setTnc(false);
                    } else {
                      setTnc(true);
                    }
                  }}
                  label="I agree to the Terms and Conditions"
                />
                {!tnc ? (
                  <Button type="submit" disabled>
                    Submit
                  </Button>
                ) : (
                  <Button type="submit" onClick={reqReg}>
                    Submit
                  </Button>
                )}
              </Form>
            </Segment>

            <Header>Rules to Join into the Network</Header>
            <li>
              <i>Enter Valid Aadhar ID & Raise a request for registration</i>
            </li>
            <li>
              <i>Network registration requires a nominal fee.</i>
            </li>
            <Header as="h4">Terms & Condition</Header>
            <li>
              <i>
                Registration Fee is nonrefundable if escrow rejects your
                candidacy.
              </i>
            </li>
          </div>
        ) : (
          LoaderAnimation()
        )}
      </>
    );
  };

  const ProsumerForm = () => {
    return (
      <div>
        {/* <Base title="Prosumer Dashboard" TitleColour="blue" /> */}
        {/* TODO: Value not changing in real time */}
        <Base title="Dashboard" TitleColour="grey" />
      </div>
    );
  };

  const ConsumerForm = () => {
    return (
      <div>
        {/* <Base title="Consumer Dashboard" TitleColour="grey" /> */}
        {/* TODO:  Value not changing in real time*/}

        <Base title="Dashboard" TitleColour="grey" />
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
              {!mintLoading ? (
                <Segment>
                  <Form>
                    <Header as="h2">Energy Factory</Header>
                    <Form.Field inline>
                      <label>Produce Energy</label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          setMintEnergy(e.target.value);
                        }}
                        placeholder="Unit of Energy"
                      />
                      <Button positive onClick={mint}>
                        Produce Energy
                      </Button>
                      {/* <p>Mint Message</p> */}
                    </Form.Field>
                    <Form.Field inline>
                      <label>Burn Energy</label>
                      <Input
                        placeholder="Unit of Energy"
                        type="number"
                        onChange={(e) => {
                          setBurnEnergy(e.target.value);
                        }}
                      />
                      <Button color="red" onClick={burn}>
                        Burn Energy
                      </Button>
                      {/* <p>Burn Message</p> */}
                    </Form.Field>
                  </Form>
                </Segment>
              ) : (
                LoaderAnimation()
              )}
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Segment>
                <Segment inverted>Listing</Segment>
                <h3>
                  Staked Energy:
                  {contractProsumer._stakedEnergyBalance.toString()}
                </h3>
                {parseInt(contractProsumer._stakedEnergyBalance.toString()) >
                0 ? (
                  <>
                    <b>
                      Price(USD): $
                      {parseInt(
                        contractProsumer._energyUnitPriceUSD.toString()
                      ) / 1e16}
                    </b>
                    <p>
                      Price(Matic):
                      {parseInt(
                        contractProsumer._energyUnitPriceMatic.toString()
                      ) / 1e18}
                      Matic
                    </p>
                  </>
                ) : (
                  <>
                    <b>Price(USD): $ 0</b>
                    <p>Price(Matic): 0 Matic</p>
                  </>
                )}
              </Segment>
            </Grid.Column>
            <Grid.Column textAlign="center">
              {!listLoading ? (
                <Segment>
                  <Form>
                    <Header as="h2" color="brown">
                      List Your Energy
                    </Header>
                    <Form.Field inline>
                      <label>Energy Unit </label>
                      <Input
                        placeholder="Unit of Energy for Listing"
                        type="number"
                        onChange={onListChange("stakedEnergy")}
                        value={stakedEnergy}
                      />
                    </Form.Field>
                    <Form.Field inline>
                      <label>Price(USD) </label>
                      <Input
                        placeholder="Price for 1 Unit"
                        onChange={onListChange("unitPriceUSD")}
                        type="number"
                        value={unitPriceUSD}
                      />
                    </Form.Field>
                    <Button color="blue" onClick={onList}>
                      List
                    </Button>
                  </Form>
                </Segment>
              ) : (
                LoaderAnimation()
              )}
            </Grid.Column>
          </Grid>
        </Segment>
      </>
    );
  };

  const BuyTableBody = ({
    date,
    producerID,
    tokensTransacted,
    unitPriceUSD,
    unitPriceMatic,
    transactionHash,
  }) => {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell textAlign="center">{date}</Table.Cell>
          <Table.Cell textAlign="center" style={{ background: "red" }}>
            Sell
          </Table.Cell>
          <Table.Cell textAlign="center">{producerID}</Table.Cell>
          <Table.Cell textAlign="center">Debit</Table.Cell>

          <Table.Cell textAlign="center">{tokensTransacted}</Table.Cell>

          <Table.Cell textAlign="center">{unitPriceUSD}</Table.Cell>
          <Table.Cell textAlign="center">{unitPriceMatic}</Table.Cell>

          <Table.Cell textAlign="center">
            <a
              href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
              target="._blank"
            >
              {transactionHash}
            </a>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  };
  const SellTableBody = ({
    date,
    consumerID,
    tokensTransacted,
    unitPriceUSD,
    unitPriceMatic,
    transactionHash,
  }) => {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell textAlign="center">{date}</Table.Cell>
          <Table.Cell textAlign="center" style={{ background: "green" }}>
            Buy
          </Table.Cell>
          <Table.Cell textAlign="center">{consumerID}</Table.Cell>
          <Table.Cell textAlign="center">Credit</Table.Cell>

          <Table.Cell textAlign="center">{tokensTransacted}</Table.Cell>

          <Table.Cell textAlign="center">{unitPriceUSD}</Table.Cell>
          <Table.Cell textAlign="center">{unitPriceMatic}</Table.Cell>

          <Table.Cell textAlign="center">
            <a
              href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
              target="._blank"
            >
              {transactionHash}
            </a>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  };

  return (
    <>
      {/*------------------- TOGGLE------------------------------------------------------------------- */}
      {/* {component} */}
      <Base title={toggleState.message} TitleColour="grey" />
      {queryProsumerID > 0 ? (
        <>
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
                  <b>Name: {prosumer.name}</b>
                </Segment>
                <Segment
                  inverted
                  compact
                  color="brown"
                  style={{ display: "inline" }}
                >
                  <b>Prosumer Id: {contractProsumer._prosumerID.toString()}</b>
                </Segment>

                <Segment
                  inverted
                  compact
                  color="blue"
                  style={{ marginTop: "4%" }}
                >
                  <b>Public Key: {prosumer.publicAddress}</b>
                </Segment>
              </Grid.Column>

              <Grid.Column verticalAlign="middle">
                <Header color="blue" size="big" textAlign="center">
                  BALANCE
                </Header>
                <Segment
                  inverted
                  color="grey"
                  style={{ margin: "auto" }}
                  compact
                >
                  <h4>
                    Energy :
                    <span style={{ color: "yellow" }}>
                      {" "}
                      {balance.energyTokenBalance.toString()} units
                    </span>
                  </h4>
                  <b>
                    Matic :
                    <span style={{ color: "yellow" }}>
                      {" "}
                      {balance.maticCoinBalance.toString()} coins
                    </span>
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
                <Table.HeaderCell colSpan="8">
                  ENERGY TRANSACTIONS
                </Table.HeaderCell>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">Date</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">
                    Sold/Buy
                  </Table.HeaderCell>
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
                  <Table.HeaderCell textAlign="center">
                    Unit Price [Matic]
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">
                    Blockchain Transaction Hash
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              {txns &&
                txns.map((e) => {
                  if (
                    e.producerID ===
                    parseInt(contractProsumer._prosumerID.toString())
                  ) {
                    //Sold

                    return (
                      <BuyTableBody
                        date={e.txnDate.substring(0, 10)}
                        producerID={e.producerID}
                        tokensTransacted={e.tokensTransacted}
                        unitPriceUSD={e.unitPriceUSD}
                        unitPriceMatic={e.unitPriceMatic}
                        transactionHash={e.transactionHash}
                      />
                    );
                  } else if (
                    e.consumerID ===
                    parseInt(contractProsumer._prosumerID.toString())
                  ) {
                    //Buy

                    return (
                      <SellTableBody
                        date={e.txnDate.substring(0, 10)}
                        consumerID={e.consumerID}
                        tokensTransacted={e.tokensTransacted}
                        unitPriceUSD={e.unitPriceUSD}
                        unitPriceMatic={e.unitPriceMatic}
                        transactionHash={e.transactionHash}
                      />
                    );
                  }
                  return <></>;
                })}
            </Table>
          </Segment>
        </>
      ) : (
        ReqRegistrationForm()
      )}
    </>
  );
};

export default ProsumerDashboard;
