// import '@/components/Comp1/comp1.scss'       // global import styles affect all components
// import styles from "./spot.module.scss";        // local import styles only affect this component

import { Table, Space, message } from "antd"; 
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";

import axios from "axios";
import { useEffect, useState } from "react";

import Transaction from "./Transaction";
import Transfer from "./Transfer";
import Withdraw from "./Withdraw";

import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";

interface Result {
  duration: string;
  wallets: Wallet[];
}

export interface Wallet {
  wallet: string;
  amount: number;
  currency: string;
}

export interface Margin {
  login: string;
  equity: number;
  margin: number;
  margin_free: number;
}

const Comp = () => {

  // const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  // const [depositAddress, setDepositAddress] = useState<typeof DepositAddress>({ network: 'TRX', address: '0x1234567890', coin: 'USDT', tag: '1234567890', url: 'https://www.trx.com' });
  // const [spotUdated, setSpotUpdated] = useState<boolean>(false);

  const [wallets, setWallets] = useState<Wallet[]>([ ]);
  const [loading, setLoading] = useState<boolean>(false)                  
  const [paggination, setPaggination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
    onChange: (page, pageSize) => {
        console.log(page, pageSize)
    }
  })

  const columns: ColumnsType<Wallet> = [
    {
      title: "Wallet",
      dataIndex: "wallet",
      key: "wallet",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      // sorter: (a, b) => a.amount - b.amount,
      // sortDirections: ["descend", "ascend"],
    },
    {
      title: "Currency",
      dataIndex: "currency",
    },
    {
      title: "Action",
      key: "action",
      render: (_: string, wallet: Wallet) => (
        <div>
          <Space size="middle">

            <Transfer wallet={wallet} onUpdated={()=> {}} /> 

            { (wallet.wallet.includes("USDT")) && <Withdraw  wallet={wallet} onUpdate={getWallets}/> }

          </Space>
        </div>
      ),
    },
  ];

  function onTableChange(newPaggination) {
    setPaggination(newPaggination)
  }

  async function getWallets() {
    setLoading(true)
    const api_host = import.meta.env.VITE_EXNESS_API_HOST

    const headers = {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    const margin = await axios.get<R<Margin>>( `${api_host}/api/v1/exness/margin`, { headers });
    margin.data.code === -1 ? message.error(`Error retrieving margin data: ${margin.data.msg}`) : console.log(margin.data.data)
    const marginFree = margin.data.data.margin_free
    const w = { wallet: "Futures", amount: marginFree, currency: "USD" }

    const resp = await axios.get<R<Result>>( `${api_host}/api/v1/exness/wallets`, { headers });
    console.log(resp.data.data);

    resp.data.data.wallets.push(w)
    resp.data.data.wallets.sort((a, b) => b.amount - a.amount)

    setWallets(resp.data.data.wallets);
    setLoading(false)

    const duration = resp.data.data.duration;
    if (resp.data.code === -1) {
      message.error(resp.data.msg);
    } else {
      message.success("Wallets loaded successfully in " + duration + " s");
    }
  }

  useEffect(() => {

  }, []);

  return (
      <Space>
            <div>
              <Transaction />

              <Space wrap>
                <div>
                  <Space wrap>

                    <Button 
                      type="default"
                      size="large"
                      icon={<SearchOutlined />}
                      style={{ background: "black", color: "white" }}
                      loading={loading}
                      onClick={getWallets} >Wallet</Button>

                  </Space>

                    <Table
                      columns={columns}
                      dataSource={wallets}
                      rowKey="wallet"
                      loading={loading}
                      pagination={paggination}
                      onChange={onTableChange} />
                </div>
              </Space>

            </div>
      </Space>
      
  );
};

export default Comp;
