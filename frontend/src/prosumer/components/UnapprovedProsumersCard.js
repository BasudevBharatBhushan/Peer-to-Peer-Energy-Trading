import React, { useState, useEffect } from "react";
import { Button, Card } from "semantic-ui-react";
import { WriteContracts, ReadContracts } from "../../blockchain/polygon";
import { ethers, BigNumber } from "ethers";
import { serializeError } from "eth-rpc-errors";
import { isAuthenticated } from "../../auth/helper";
import { LoaderAnimation } from "../../core/components/LoaderAnimation";
import { GSN_WriteContracts } from "../../blockchain/gsn";

const _ = require("lodash");

const UnapprovedProsumersCard = ({
  _prosumerAddress = "0xFCf4BE15b7E65D6aAC2255C8d4160E3b78c0261b",
  _prosumerAadhar = "334535477102",
  _index = "1",
}) => {
  const { prosumer } = isAuthenticated();
  const [approveFlag, setApproveFlag] = useState(1);
  const [approvalMessage, setApprovalMessage] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      approvalStatus();
    }
  }, [approveFlag]);

  const approveProsumer = async () => {
    if (
      window.ethereum &&
      window.ethereum.selectedAddress === _.toLower(prosumer.publicAddress)
    ) {
      try {
        setLoading(true);
        const ApproveProsumer =
          await GSN_WriteContracts.approveProsumer_OwnerSpecific(
            BigNumber.from(_index)
          );
        await ApproveProsumer.wait(1);
        setLoading(false);
        setApproveFlag(2);
        alert(`Prosumer Approved by You \n Txn Hash:${ApproveProsumer.hash}`);
      } catch (error) {
        setLoading(false);

        const serializedError = serializeError(error);
        console.log(serializedError.message);
        alert(`Error: ${serializedError.data.originalError.reason}`);
      }
    } else {
      alert(`Please Connect the Wallet with your Registered Address \n
      ${prosumer.publicAddress}
      `);
    }
  };

  const disApproveProsumer = async () => {
    if (
      window.ethereum &&
      window.ethereum.selectedAddress === _.toLower(prosumer.publicAddress)
    ) {
      try {
        setLoading(true);
        const DisApproveProsumer =
          await GSN_WriteContracts.DisApproveProsumer_OwnerSpecific(
            BigNumber.from(_index)
          );
        await DisApproveProsumer.wait(1);
        setLoading(false);
        setApproveFlag(3);
        alert(
          `Prosumer Dispproved by You \n Txn Hash:${DisApproveProsumer.hash}`
        );
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

  const approvalStatus = async () => {
    if (window.ethereum) {
      try {
        const ApprovalStatus =
          await WriteContracts.showApprovalStatus_OwnerSpecific(
            _prosumerAddress
          );

        if (ApprovalStatus === "Prosumer Not Approved Yet") {
          setApproveFlag(1);
        } else if (ApprovalStatus === "Prosumer Approved") {
          setApproveFlag(2);
        } else if (ApprovalStatus === "Prosumer Disapproved") {
          setApproveFlag(3);
        }
        setApprovalMessage(ApprovalStatus);
        console.log(ApprovalStatus);
      } catch (error) {
        const serializedError = serializeError(error);
        alert(`Error: ${serializedError.data.originalError.reason}`);
        console.log(serializedError.data.originalError.reason);
      }
    }
  };

  return (
    <div>
      {!loading ? (
        <div>
          <Card fluid>
            <Card.Content>
              <Card.Header style={{ color: "blue" }}>
                Unverified User: {_index + 1}
              </Card.Header>

              <Card.Description>
                <span>
                  <b>Address: </b>
                </span>
                {_prosumerAddress}
              </Card.Description>
              <Card.Description>
                <span>
                  <b>Aadhar Id: </b>
                </span>
                {_prosumerAadhar}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div>
                {approveFlag == 1 ? (
                  <div>
                    <Button color="green" onClick={approveProsumer}>
                      Approve
                    </Button>
                    <Button color="red" onClick={disApproveProsumer}>
                      DisApprove
                    </Button>
                  </div>
                ) : approveFlag == 2 ? (
                  <div>
                    <Button color="green" disabled>
                      Approve
                    </Button>
                    <Button color="red" onClick={disApproveProsumer}>
                      DisApprove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button color="green" onClick={approveProsumer}>
                      Approve
                    </Button>
                    <Button color="red" disabled>
                      DisApprove
                    </Button>
                  </div>
                )}

                {/* <Button onClick={approvalStatus}>Approval Status</Button> */}
              </div>
              <p style={{ color: "brown" }}>{approvalMessage}</p>
            </Card.Content>
          </Card>
        </div>
      ) : (
        LoaderAnimation()
      )}
    </div>
  );
};

export default UnapprovedProsumersCard;
