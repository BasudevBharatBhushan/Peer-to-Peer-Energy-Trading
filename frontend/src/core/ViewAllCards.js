import { useState, useEffect } from "react";
import { API } from "../backend";
import {
  Button,
  Card,
  Grid,
  Image,
  Segment,
  Transition,
} from "semantic-ui-react";
import PostCard from "./components/PostCard";
import { getProsumerById } from "../prosumer/helper/prosumerapicall";
import { isAuthenticated } from "../auth/helper";

const ViewAllCards = () => {
  const [obj, setObj] = useState([]);
  const { prosumer, token } = isAuthenticated();

  const [queryProsumer, setQueryProsumer] = useState({});

  useEffect(() => {
    fetch(`${API}/card/all`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setObj(data);
        console.log("OBJECTS", obj[0]);
      });
  }, []);

  const getProsumer = async (prosumerID) => {
    const x = await getProsumerById(prosumerID).then((data) => {
      return data;
    });
    // setQueryProsumer(x);
    console.log(x);
    console.log(queryProsumer);
  };

  return (
    <Grid columns={3} divided="vertically">
      <Grid.Row>
        <Transition.Group>
          {obj &&
            obj.map((card) => {
              {
                /* getProsumer(card.listProsumer); */
              }

              return (
                <Grid.Column>
                  <PostCard
                    Prosumer_id={queryProsumer.publicAddress}
                    Prosumer_Name="BASUDEV"
                    stakedEnergy="2"
                    uintPriceUSD="8"
                    unitPriceMatic="0.001"
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
