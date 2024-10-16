// import styles from "./spot.module.scss"; // local import styles only affect this component

import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { useState } from "react";

import SpotDepositAddress from "./Address";

const Comp = () => {

  const [depositOpen, setDepositOpen] = useState(false);

  const onCancel = () => {
    setDepositOpen(false);
  }

  const onClick = (open: boolean) => {
    console.log("Deposit|onClick: Deposit");
    setDepositOpen(open);
  };

  return (
    <div>
      <Button
        type="default"
        icon={<SearchOutlined />}
        style={{ background: "rgb(109, 208, 178)", color: "white" }}
        size="large"
        onClick={() => { onClick(true) }} >Deposit</Button>
      
      <SpotDepositAddress open={depositOpen} onCancel={onCancel} />
    </div>
  );
};

export default Comp;
