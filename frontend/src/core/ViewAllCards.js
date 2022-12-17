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
  const [approvedProsumers, setApprovedProsumers] = useState([]);
  const [unitMaticPrice, setUnitMaticPrice] = useState(0);

  const [queryProsumer, setQueryProsumer] = useState({});

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
      console.log();
      setUnitMaticPrice(
        parseInt(GetProsumer[0]._energyUnitPriceMatic.toString()) / 1e18
      );
    }
  };

  return (
    <Grid columns={3} divided="vertically">
      <Grid.Row>
        <Transition.Group>
          {obj &&
            obj.map((card) => {
              return (
                <Grid.Column>
                  <PostCard
                    cardID={card._id}
                    Prosumer_id={card.prosumerID}
                    Prosumer_Name={card.name}
                    stakedEnergy={card.stakedEnergy}
                    uintPriceUSD={card.unitPriceUSD}
                    unitPriceMatic={unitMaticPrice}
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
