import { useState, useEffect } from "react";
import { API } from "../backend";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "./components/PostCard";
import { getProsumerById } from "../prosumer/helper/prosumerapicall";
import { isAuthenticated } from "../auth/helper";
import { ReadContracts } from "../blockchain/polygon";

const ViewAllCards = () => {
  const [obj, setObj] = useState([]);
  const { prosumer, token } = isAuthenticated();
  const [approvedProsumers, setApprovedProsumers] = useState([
    {
      _prosumerID: 0,
      _address: "",
      _aadharId: 0, //12 digit
      _approved: true,
      _energyUnitPriceUSD: 0,
      _energyUnitPriceMatic: 0,
      _stakedEnergyBalance: 0,
    },
  ]);
  const [unitMaticPrice, setUnitMaticPrice] = useState([]);

  const [queryProsumer, setQueryProsumer] = useState();

  useEffect(() => {
    fetch(`${API}/card/all`)
      .then((response) => response.json())
      .then((data) => {
        setObj(data);
        console.log("OBJECTS", obj[0]);
      });
    getProsumer();
  }, []);

  const getProsumer = async () => {
    if (window.ethereum) {
      const GetProsumer = await ReadContracts.show_Approved_Prosumers();
      setApprovedProsumers(GetProsumer);

      // if(approvedProsumers){
      //   approvedProsumers.map((e)=>{
      //     setUnit
      //   })
      // }

      // setUnitMaticPrice(
      //   parseInt(GetProsumer[id]._energyUnitPriceMatic.toString()) / 1e18
      // );

      // const GetProsumer = await ReadContracts.ApprovedProsumers(id);
      // setQueryProsumer(GetProsumer);

      // setUnitMaticPrice(
      //   parseInt(queryProsumer._energyUnitPriceMatic.toString()) / 1e18
      // );
    }
  };

  return (
    <Grid columns={3} divided="vertically">
      <Grid.Row>
        <Transition.Group>
          {obj &&
            obj.map((card) => {
              const x = card.prosumerID - 1;

              const y =
                approvedProsumers[x]._energyUnitPriceMatic.toString() / 1e18;
              return (
                <Grid.Column>
                  <PostCard
                    cardID={card._id}
                    Prosumer_id={card.prosumerID}
                    Prosumer_Name={card.name}
                    stakedEnergy={card.stakedEnergy}
                    uintPriceUSD={card.unitPriceUSD}
                    unitPriceMatic={y}
                  />
                </Grid.Column>
              );
            })}
        </Transition.Group>
      </Grid.Row>
    </Grid>
  );
};

export default ViewAllCards;
