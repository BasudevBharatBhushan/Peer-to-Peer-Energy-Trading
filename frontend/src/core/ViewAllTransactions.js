import React, { useState, useEffect } from "react";
import Base from "./Base";
import { getTxns } from "./helper/transactionHelper";
import { Segment, Table } from "semantic-ui-react";

const ViewAllTransactions = () => {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    getAllTxns();
  }, []);

  const getAllTxns = () => {
    const GetAllTxns = getTxns()
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTxns(data);
      });
    console.log(txns);
  };

  return (
    <div>
      <Base title="Successfull Transactions" TitleColour="green" />
      <Segment>
        <Table inverted>
          <Table.Header>
            <Table.HeaderCell colSpan="8">ENERGY TRANSACTIONS</Table.HeaderCell>
            <Table.Row>
              <Table.HeaderCell textAlign="center">Date</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Producer ID
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Consumer ID
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Energy Transfered
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Unit Price (USD) $
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Unit Price [Matic]
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Matic Paid</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Blockchain Transaction Hash
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {txns &&
            txns.map((e) => {
              return (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell textAlign="center">
                      {e.txnDate.substring(0, 10)}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{e.producerID}</Table.Cell>
                    <Table.Cell textAlign="center">{e.consumerID}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {e.tokensTransacted}
                    </Table.Cell>

                    <Table.Cell textAlign="center">{e.unitPriceUSD}</Table.Cell>

                    <Table.Cell textAlign="center">
                      {e.unitPriceMatic}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {e.maticsTransacted}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <a
                        href={`https://mumbai.polygonscan.com/tx/${e.transactionHash}`}
                        target="._blank"
                      >
                        {e.transactionHash}
                      </a>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="7">
                Total Successful Transactions:{" "}
                <span style={{ color: "yellow" }}>{txns.length}</span>
              </Table.HeaderCell>

              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>
    </div>
  );
};

export default ViewAllTransactions;
