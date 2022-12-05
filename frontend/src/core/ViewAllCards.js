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

const ViewAllCards = () => {
  const [obj, setObj] = useState([]);

  useEffect(() => {
    fetch(`${API}/card/all`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setObj(data);
        console.log("OBJECTS", obj[0]);
      });
  }, []);

  return (
    <Grid columns={3} divided="vertically">
      <Grid.Row>
        <Transition.Group>
          {obj &&
            obj.map((card) => {
              return (
                <Grid.Column>
                  <PostCard
                    Prosumer_id="1"
                    Prosumer_Name="BASUDEV"
                    stakedEnergy="2"
                    uintPriceUSD="0.001"
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
