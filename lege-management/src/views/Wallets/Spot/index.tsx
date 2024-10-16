// import '@/components/Comp1/comp1.scss'       // global import styles affect all components
import styles from "./spot.module.scss";        // local import styles only affect this component

import { Table, Space } from "antd"; 
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";

import axios from "axios";
import { useEffect, useState } from "react";

import SpotTransfer from "@/views/Wallets/Spot/Transfer";
import SpotWithdraw from "@/views/Wallets/Spot/Withdraw";
import SpotDeposit from "@/views/Wallets/Spot/Deposit";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";

interface Spot {
  wallet: string;
  asset: string;
  free: number;
  locked: number;
}


const Comp = () => {
  // const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  // const [depositAddress, setDepositAddress] = useState<typeof DepositAddress>({ network: 'TRX', address: '0x1234567890', coin: 'USDT', tag: '1234567890', url: 'https://www.trx.com' });
  const [spotBalance, setSpotBalance] = useState<Spot[]>([
      { wallet: "Spot", asset: "USDT", free: 0.0, locked: 0.0 },
  ]);
  const [spotUdated, setSpotUpdated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)                  

  const columns: ColumnsType<Spot> = [
    {
      title: "Wallet",
      dataIndex: "wallet",
      key: "wallet",
    },
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
    },
    {
      title: "Balance",
      dataIndex: "free",
    },
    {
      title: "Action",
      key: "action",
      render: (_, spotBalance) => (
        <div>
          <Space size="middle">
            <SpotDeposit />
            <SpotWithdraw onUpdated={()=> {setSpotUpdated(true)}}/>
            <SpotTransfer onUpdated={()=> {setSpotUpdated(true)}} />
          </Space>
        </div>
      ),
    },
  ];

  const api_host = import.meta.env.VITE_API_HOST

  async function getSpotBalance() {
    const headers = {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
    const resp = await axios.get<R<Spot[]>>( `${api_host}/balance/spot`, { headers });
    console.log(resp.data.data);
    resp.data.data[0].wallet = "Spot";  // resp.data.data[0] is the first element in the array
    setSpotBalance(resp.data.data);     // will trigger 'View' rendering

    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    getSpotBalance();
    setSpotUpdated(false);
  }, [spotUdated, loading]);

  return (
      <Space wrap>
        <div>
            <Button 
              type="default"
              size="large"
              icon={<SearchOutlined />}
              style={{ background: "black", color: "white" }}
              onClick={()=>{ setLoading(true)}} >Spot</Button>
            <Table
              columns={columns}
              dataSource={spotBalance}
              rowKey="asset"
              loading={loading}
              pagination={false}
              onChange={() => {}} />
        </div>
      </Space>
  );
};

export default Comp;
