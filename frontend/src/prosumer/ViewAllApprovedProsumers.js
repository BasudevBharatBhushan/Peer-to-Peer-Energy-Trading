import React, { useState, useEffect } from "react";
import { ReadContracts } from "../blockchain/polygon";
import { isAuthenticated } from "../auth/helper/index";
import { updateProsumer } from "./helper/prosumerapicall";
import { API } from "../backend";
import { Button } from "semantic-ui-react";
import ApprovedProsumerCard from "./components/ApprovedProsumerCard";

const ViewAllApprovedProsumers = () => {
  const [mongoProsumer, setmongoProsumer] = useState([]);
  const [contractProsumer, setContractProsumer] = useState([]);

  useEffect(() => {
    fetch(`${API}/prosumer/all`)
      .then((response) => response.json())
      .then((data) => {
        setmongoProsumer(data);
      });
    approvedProsumers();
  }, [mongoProsumer]);

  const approvedProsumers = async () => {
    if (window.ethereum) {
      try {
        const ApprovedProsumers = await ReadContracts.show_Approved_Prosumers();
        setContractProsumer(ApprovedProsumers);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateProsumerDatabase = () => {
    console.log("updateProsumer triggered");
    console.log(mongoProsumer.length, contractProsumer.length);
    const contractUser = contractProsumer[contractProsumer.length - 1];

    if (mongoProsumer.length - 3 != contractProsumer.length) {
      const ProsumertoBeUpdated = mongoProsumer.filter(
        (e) => e.publicAddress == contractUser._address.toString()
      );
      const prosumerId = parseInt(contractUser._prosumerID.toString());
      const aadharId = parseInt(contractUser._aadharId.toString());
      console.log(ProsumertoBeUpdated[0]._id);
      console.log(prosumerId);

      updateProsumer(ProsumertoBeUpdated[0]._id, { prosumerId, aadharId }).then(
        (data) => {
          if (data.error) {
            console.log("error in updating");
          } else {
            console.log("Update Successful");
          }
        }
      );
    }
  };

  return (
    <div>
      <h3>Approved Prosumers</h3>
      <div>
        {mongoProsumer &&
          mongoProsumer
            .filter((e) => e.prosumerId > 0)
            .map((f) => (
              <ApprovedProsumerCard
                _prosumerAadhar={f.aadharId}
                _prosumerAddress={f.publicAddress}
                _prosumerID={f.prosumerId}
                _email={f.email}
                _name={f.name}
              />
            ))}
      </div>
      <div>
        <Button
          color="violet"
          style={{ marginTop: "20px" }}
          onClick={updateProsumerDatabase}
        >
          update Prosumer Database
        </Button>
      </div>
    </div>
  );
};

export default ViewAllApprovedProsumers;
