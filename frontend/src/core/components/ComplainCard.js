import React, { useState } from "react";
import {
  Button,
  Card,
  Grid,
  Image,
  Segment,
  Modal,
  Header,
  Transition,
  Label,
} from "semantic-ui-react";

let Lorem =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";

const ComplainCard = ({
  complainId = 1,
  complainantId = 1,
  accusedId = 2,
  complain = "Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  status = true,
}) => {
  const [complains, setComplains] = useState([]);

  const getComplains = () => {
    if (window.ethreum) {
    }
  };

  return (
    <div>
      <Grid columns={3} divided style={{ width: "70%" }}>
        <Grid.Row>
          <Transition.Group>
            <Grid.Column>
              <Card fluid>
                <Card.Content>
                  <Segment inverted color="orange">
                    <h3>Complain Id: {complainId}</h3>
                  </Segment>
                  <Card.Meta style={{ color: "darkblue" }}>
                    Complainant ID: {complainantId}
                  </Card.Meta>
                  <Card.Meta style={{ color: "darkblue" }}>
                    Accused ID: {accusedId}
                  </Card.Meta>
                  <Segment
                    inverted
                    style={{
                      //   width: "40%",
                      padding: "5px",
                      display: "inline-block",
                    }}
                  >
                    <p>{complain}</p>
                  </Segment>
                </Card.Content>
                {status === false ? (
                  <Label color="red" horizontal>
                    Pending
                  </Label>
                ) : (
                  <Label color="green" horizontal>
                    Verified
                  </Label>
                )}
              </Card>
            </Grid.Column>
          </Transition.Group>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default ComplainCard;
