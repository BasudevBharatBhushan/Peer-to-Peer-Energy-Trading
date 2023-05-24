import "../App.css";
import React, { Children } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Grid, Image, Segment, Icon } from "semantic-ui-react";

const Base = ({
  title = "My Title",
  TitleColour = "black",
  children,
  style,
}) => {
  const navigate = useNavigate();
  return (
    <div>
      <NavBar title={title} TitleColour={TitleColour} style={style} />
      {children}
      <Segment
        style={{
          position: "fixed",
          bottom: "0px",
          width: "100%",
        }}
      >
        <Grid columns={2} relaxed="very">
          <Grid.Column>
            <div style={{ display: "block" }}>
              <Segment
                style={{
                  width: "20%",
                }}
              >
                <a
                  target="._blank"
                  href="https://github.com/BasudevBharatBhushan/Peer-to-Peer-Energy-Trading"
                  style={{ color: "black" }}
                >
                  <Icon
                    name="github"
                    size="large"
                    style={{ paddingRight: "30px" }}
                  />
                </a>

                <Icon
                  name="youtube"
                  size="large"
                  style={{ paddingRight: "30px" }}
                />
                <Icon name="paperclip" size="large" />
              </Segment>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div
              style={{
                textAlign: "right",
              }}
            >
              <h5>Peer-to-Peer Energy Trading Using Blockchain</h5>
              <p>Made by CSE Dept</p>
            </div>
          </Grid.Column>
        </Grid>

        {/* <Divider vertical>POLYGON + ETHEREUM</Divider> */}
      </Segment>
    </div>
  );
};

export default Base;
