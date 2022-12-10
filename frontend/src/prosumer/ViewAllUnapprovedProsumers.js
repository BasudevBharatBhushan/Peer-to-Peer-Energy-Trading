import React, { useState, useEffect, useCallback } from "react";
import UnapprovedProsumersCard from "./components/UnapprovedProsumersCard";
import { ethers, BigNumber } from "ethers";
import { WriteContracts } from "../blockchain/polygon";

const ViewAllUnapprovedProsumers = () => {
  const [unApprovedProsumers, setUnApprovedProsumers] = useState([]);
  const [arrlen, setArrlen] = useState();

  useEffect(() => {
    viewUnapprovedProsumer();
  }, [arrlen]);

  const viewUnapprovedProsumer = async () => {
    if (window.ethereum) {
      try {
        const data = await WriteContracts.show_Unapproved_Prosumers();
        setUnApprovedProsumers(data);
        console.log(data[0]._address.toString());
        setArrlen(data.length);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <h3>Unapproved Prosumers</h3>

      <div>
        {unApprovedProsumers.length > 0 &&
          unApprovedProsumers.map((data, index) => (
            <UnapprovedProsumersCard
              _index={index}
              _prosumerAddress={data._address.toString()}
              _prosumerAadhar={data._aadharId.toString()}
            />
          ))}
      </div>

      {/* {unApprovedProsumers} */}
    </div>
  );
};

export default ViewAllUnapprovedProsumers;
