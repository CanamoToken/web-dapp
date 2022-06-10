/* eslint-disable */
import React, { useEffect } from "react";
import { Form, notification } from "antd";
import { useMemo, useState } from "react";
import Address from "components/Address/Address";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import ContractMethods from "./ContractMethods";
import ContractResolver from "./ContractResolver";

// Chakra imports
import {
  Flex, Text
} from "@chakra-ui/react";
// Custom components
import Card from "../../components/Card/Card.js";
import Blockie from "../Blockie";

export default function Contract() {
  const { Moralis, chainId, isAuthenticated, account } = useMoralis();
  const [responses, setResponses] = useState({});
  const [contract, setContract] = useState();

  const [address, setAddress] = useState();

  const styles = {
    title: {
      fontSize: "30px",
      fontWeight: "600",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "5px",
    },
    card: {
      boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
      border: "1px solid #e7eaf3",
      borderRadius: "1rem",
      width: "450px",
      fontSize: "16px",
      fontWeight: "500",
    },
  };

  useEffect(() => {
    setAddress((isAuthenticated && account));
  }, [account, isAuthenticated]);

  if (!address) {
    return (
      <Flex
        direction="column"
        pt={{ base: "120px", md: "75px" }}
        alignContent="center"
        alignItems="center"
      ><Card
        style={styles.card}
        title={
          <div style={styles.header}>
            <Blockie scale={5} avatar currentWallet style />
            <Address size="6" copyable />
          </div>
        }
      >
          <div
            style={{
              width: "auto",
              height: "300px",
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Text>Please connect Wallet</Text>
          </div>

        </Card>
      </Flex>
    );
  }
  else {
    return (
      <Flex
        direction="column"
        pt={{ base: "120px", md: "75px" }}
        alignContent="center"
        alignItems="center"
      ><Card
        style={styles.card}
        title={
          <div style={styles.header}>
            <Blockie scale={5} avatar currentWallet style />
            <Address size="6" copyable />
          </div>
        }
      >
          <div
            style={{
              width: "auto",
              height: "300px",
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Text>Coming Soon</Text>
          </div>

        </Card>
      </Flex>
    );
  }

  /**Moralis Live query for displaying contract's events*/
  const { data } = useMoralisQuery("Events", (query) => query, [], {
    live: true,
  });

  /** Automatically builds write and read components for interacting with contract*/
  const displayedContractFunctions = useMemo(() => {
    if (!contract?.abi) return [];
    return contract.abi.filter((method) => method["type"] === "function");
  }, [contract]);

  /** Returns true in case if contract is deployed to active chain in wallet */
  const isDeployedToActiveChain = useMemo(() => {
    if (!contract?.networks) return undefined;
    return [parseInt(chainId, 16)] in contract.networks;
  }, [contract, chainId]);

  const contractAddress = useMemo(() => {
    if (!isDeployedToActiveChain) return null;
    return contract.networks[parseInt(chainId, 16)]?.["address"] || null;
  }, [chainId, contract, isDeployedToActiveChain]);

  /** Default function for showing notifications*/
  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
    });
  };

  return (
    <Flex
      direction="column"
      pt={{ base: "120px", md: "75px" }}
      alignContent="center"
      alignItems="center"
    >
      <div
        style={{
          margin: "auto",
          display: "flex",
          gap: "20px",
          marginTop: "25",
          width: "70vw",
        }}
      >
        <Card
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Your contract: {contract?.contractName}
              <Address
                avatar="left"
                copyable
                address={contractAddress}
                size={8}
              />
            </div>
          }
          size="large"
          style={{
            width: "60%",
            boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
            border: "1px solid #e7eaf3",
            borderRadius: "0.5rem",
          }}
        >
          <ContractResolver setContract={setContract} contract={contract} />

          {isDeployedToActiveChain === true && (
            <Form.Provider
              onFormFinish={async (name, { forms }) => {
                const params = forms[name].getFieldsValue();

                let isView = false;
                /*eslint no-unsafe-optional-chaining: "error"*/
                for (let method of contract?.abi ?? method) {
                  if (method.name !== name) continue;
                  console.log(method);
                  if (method.stateMutability === "view") isView = true;
                }

                const options = {
                  contractAddress,
                  functionName: name,
                  abi: contract?.abi,
                  params,
                };

                if (!isView) {
                  const tx = await Moralis.executeFunction({
                    awaitReceipt: false,
                    ...options,
                  });
                  tx.on("transactionHash", (hash) => {
                    setResponses({
                      ...responses,
                      [name]: { result: null, isLoading: true },
                    });
                    openNotification({
                      message: "🔊 New Transaction",
                      description: `${hash}`,
                    });
                    console.log("🔊 New Transaction", hash);
                  })
                    .on("receipt", (receipt) => {
                      setResponses({
                        ...responses,
                        [name]: { result: null, isLoading: false },
                      });
                      openNotification({
                        message: "📃 New Receipt",
                        description: `${receipt.transactionHash}`,
                      });
                      console.log("🔊 New Receipt: ", receipt);
                    })
                    .on("error", (error) => {
                      console.error(error);
                    });
                } else {
                  console.log("options22", options);
                  Moralis.executeFunction(options).then((response) =>
                    setResponses({
                      ...responses,
                      [name]: { result: response, isLoading: false },
                    }),
                  );
                }
              }}
            >
              <ContractMethods
                displayedContractFunctions={displayedContractFunctions}
                responses={responses}
              />
            </Form.Provider>
          )}
          {isDeployedToActiveChain === false && (
            <>{`The contract is not deployed to the active ${chainId} chain. Switch your active chain or try agan later.`}</>
          )}
        </Card>
        <Card
          title={"Contract Events"}
          size="large"
          style={{
            width: "40%",
            boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
            border: "1px solid #e7eaf3",
            borderRadius: "0.5rem",
          }}
        >
          {data.map((event, key) => (
            <Card
              title={"Transfer event"}
              size="small"
              style={{ marginBottom: "20px" }}
              key={key}
            >
              {getEllipsisTxt(event.attributes.transaction_hash, 14)}
            </Card>
          ))}
        </Card>
      </div>
    </Flex>

  );
}
