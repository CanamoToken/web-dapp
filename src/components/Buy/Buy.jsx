import { useState, useEffect } from 'react';
import Transfer from "./components/Transfer";
import NativeBalance from "../NativeBalance";
import Address from "../Address/Address";
import Blockie from "../Blockie";
import OnramperWidget from "@onramper/widget";

import { useMoralis } from "react-moralis";

// Chakra imports
import {
  Flex, Text
} from "@chakra-ui/react";
// Custom components
import Card from "../Card/Card.js";
import { Button } from "antd";

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

function Buy() {

  const { account, isAuthenticated, Moralis } = useMoralis();
  Moralis.initPlugins();

  const [address, setAddress] = useState();

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

  const wallets = {
    USDC: { address: address }
  };

  return (
    <Flex
      direction="column"
      pt={{ base: "120px", md: "75px" }}
      alignContent="center"
      alignItems="center"
    >
      <Card
        style={styles.card}
        title={
          <div style={styles.header}>
            {/*             <Blockie scale={5} avatar currentWallet style />
            <Address size="6" copyable /> */}
          </div>
        }
      >
        <div
          style={{
            width: "auto",
            height: "660px",
          }}
        >
          <OnramperWidget
            API_KEY={"pk_test_nsxyAGqGblAQczQGs2ma93ONb128a9s50tG1lAW1LTw0"}
            defaultAddrs={{ USDC: '123' }}
            defaultCrypto={"USDC"}
            isAddressEditable={true}
            defaultAmount={495}
            redirectURL={"https://app.canamoglobal.com"}
          />

        </div>

      </Card>
    </Flex>
  );
}

export default Buy;
