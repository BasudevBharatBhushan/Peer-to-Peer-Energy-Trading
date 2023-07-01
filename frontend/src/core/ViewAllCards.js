import { useState, useEffect } from "react";
import { API } from "../backend";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "./components/PostCard";
import { getProsumerById } from "../prosumer/helper/prosumerapicall";
import { isAuthenticated } from "../auth/helper";
import { INR_to_USD } from "./helper/priceConverter";

const ViewAllCards = () => {
  const [obj, setObj] = useState([]);
  const { prosumer, token } = isAuthenticated();

  useEffect(() => {
    fetch(`${API}/card/all`)
      .then((response) => response.json())
      .then((data) => {
        setObj(data);
        console.log("OBJECTS", obj[0]);
      });
  }, []);

  // const inr_to_usd = ()=>{
  //   const usdPrice =
  // }

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
                    unitPriceMatic={card.unitPriceMatic}
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
