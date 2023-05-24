import styles from "./Style/NavBar.module.css";
import { useNavigate } from "react-router-dom";
import React, { Fragment, useState, useEffect, useRef } from "react";
import { Button, Menu, Segment, Header, Icon } from "semantic-ui-react";
import { signout, isAuthenticated } from "../auth/helper";
import { ConnectWallet } from "./components/ConnectWallet.js";

const NavBar = ({
  title = "TITLE GOES HERE",
  TitleColour = "black",
  style,
}) => {
  const navigate = useNavigate();
  const [navState, setNavState] = useState();
  const [accounts, setAccounts] = useState([]);
  const isConnected = Boolean(accounts[0]);
  const { prosumer } = isAuthenticated();

  useEffect(() => {
    connectAccount();
  }, []);

  async function connectAccount() {
    if (window.ethereum) {
      setAccounts(await ConnectWallet());
    }
  }

  // const scrollTo = (ref) => {
  //   if (!re) return;

  //   ref.current.scrollIntoView({ behaviour: "smooth" });
  // };

  return (
    <Menu className="Navbar" pointing secondary style={style}>
      <Menu.Item
        name="Home"
        onClick={() => {
          navigate("/");
        }}
      />
      {isAuthenticated() && isAuthenticated().prosumer.role > 0 && (
        <>
          <Menu.Item
            name="Escrow Dashboard"
            onClick={() => {
              navigate("/escrow/dashboard");
            }}
          />
          <Menu.Item
            name="Pending Transactions"
            onClick={() => {
              navigate("/escrow/pendingtransactions");
            }}
          />
        </>
      )}
      {isAuthenticated() && isAuthenticated().prosumer.role === 0 && (
        <Menu.Item
          name="Dashboard"
          onClick={() => {
            navigate("/prosumer/dashboard");
          }}
        />
      )}
      <Menu.Item
        name="View all Trades"
        onClick={() => {
          navigate("/transactions");
        }}
      />
      {window.location.pathname !== "/About" && (
        <Menu.Item>
          <Segment
            inverted
            style={{
              padding: "7px",
              position: "fixed",
              marginBottom: "15px",
              background: `${TitleColour}`,
            }}
          >
            <b>{title}</b>
          </Segment>
        </Menu.Item>
      )}

      {/* <Segment size="mini">Title</Segment> */}
      <Menu.Menu position="right">
        {/* {window.location.pathname == "/About" && (
          <Button.Group size="mini" compact color="blue">
            <Button>1</Button>
            <Button>2</Button>
            <Button onClick={scrollFunc}>3</Button>
            <Button>4</Button>
            <Button>5</Button>
            <Button>6</Button>
            <Button>7</Button>
            <Button>8</Button>
            <Button>9</Button>
            <Button>10</Button>
            <Button>11</Button>
            <Button>12</Button>
            <Button>13</Button>
            <Button>14</Button>
            <Button>15</Button>
            <Button>16</Button>
            <Button>17</Button>
            <Button>18</Button>
            <Button>19</Button>
            <Button>20</Button>
          </Button.Group>
        )} */}

        {isAuthenticated() && (
          <>
            {isConnected ? (
              <b style={{ color: "#1DB954", marginTop: "5px" }}>
                Metamask Connected
              </b>
            ) : (
              <button onClick={connectAccount}>Connect Wallet</button>
            )}
          </>
        )}
        <Menu.Item>
          <Icon
            name="refresh"
            onClick={() => {
              window.location.reload();
            }}
          />
        </Menu.Item>
        <Menu.Item
          name="About"
          onClick={() => {
            navigate("/About");
          }}
        />
        {!isAuthenticated() && (
          <Fragment>
            <Menu.Item
              name="Signup"
              onClick={() => {
                navigate("/signup");
              }}
            />
            <Menu.Item
              name="Signin"
              onClick={() => {
                navigate("/signin");
              }}
            />
          </Fragment>
        )}
        {/* {isAuthenticated() && <Menu.Item name="Wallet" onClick={{}} />} */}
        {isAuthenticated() && (
          <Menu.Item
            name="Signout"
            onClick={() => {
              signout(() => {
                navigate("/");
              });
            }}
          />
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default NavBar;
