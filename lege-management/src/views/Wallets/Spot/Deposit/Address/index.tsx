import styles from "./spot.module.scss";

import {
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Select,
} from "antd";

import axios from "axios";

import { useEffect, useState } from "react";

interface DepositAddress {
  network: string;
  address: string;
  coin: string;
  tag: string;
  url: string;
}

const Comp = ({ open, onCancel }: { open?: boolean, onCancel?: () => void; }) => {

  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState<string>("TRX");
  const [coin, setCoin] = useState<string>("USDT");
  const [address, setAddress] = useState<string>();

  const api_host = import.meta.env.VITE_API_HOST

  async function requestAddress(network: string, coin: string): Promise<DepositAddress> {
    const params = new URLSearchParams();
    params.append("network", network);
    params.append("coin", coin);
    const resp = await axios.get<R<DepositAddress>>(
        `${api_host}/wallets/deposit/address`,
        {
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            params,
        }
    );
    return resp.data.data;
  }

  const handleSearch = async () => {
      setLoading(true);
      const values = await form.validateFields();       // To get 'form' data
      console.log(`Click on Search: ${values.network}/${values.coin}/${values.address}`);

      const data = await requestAddress(values.network, values.coin);         
      setAddress(data.address);

      setTimeout(() => {
        setLoading(false);
      }, 500)
  }

  const { Item } = Form;          // extract 'Form.Item' from 'Form'

  const [form] = Form.useForm();  // To achieve 'Form' data

  const initialValues = {
    network: network,
    coin: coin,
    address: address,
  };

  const handleNetworkChange = async (value: string) => {
    console.log(`selected ${value}`);
    const values = await form.validateFields();
    setNetwork(values.network);
  };

  const handleCoinChange = async (value: string) => {
    console.log(`selected ${value}`);
    const values = await form.validateFields();
    setCoin(values.coin);
  };
  
  useEffect(() => {
    async function updateDepositAddress() {
      // const values = await form.validateFields();     // To get 'form' data
      const params = new URLSearchParams();
      params.append("network", network);
      params.append("network", coin);
      const resp = await axios.get<R<DepositAddress>>(
          `${api_host}/wallets/deposit/address`,
          {
              headers: {
                  "ngrok-skip-browser-warning": "true",
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
              },
              params,
          }
      );

      const code = resp.data.code
      const msg = resp.data.msg 
      const data = resp.data.data
      if (code !== 0) {
          message.error(`${msg}`);
      } else {
          console.log(`Spot|Deposit|Address: ${msg}`);
      }
      
      form.setFieldsValue({ address: data.address });
    }

    console.log(`useEffect: ${network}/${coin}/${form.getFieldValue('address')}}}`);
    updateDepositAddress();
  }, [network, coin, address, form]);

  console.log("Spot|Deposit|Address");

  return (
    <div className={styles.box}>
      <Modal
        title="Deposit Address"
        open={open}
        onCancel={onCancel}
        onOk={handleSearch}
        footer={[
          <Button key="back" onClick={onCancel}>Cancel</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleSearch}>Search</Button>,
        ]}>
        <Form form={form} layout="vertical" labelAlign="left" initialValues={initialValues} >
          <Space wrap>
            <Item label="Network" name="network">
              <Select
                style={{ width: 120 }}
                onChange={handleNetworkChange}
                options={[
                  { value: 'TRX', label: 'TRX' },
                  { value: 'ETH', label: 'ETH' },
                ]} />
            </Item>
            <Item label="Coin" name="coin">
              <Select
                style={{ width: 120 }}
                onChange={handleCoinChange}
                options={[
                  { value: 'USDT', label: 'USDT' },
                  { value: 'ETH', label: 'ETH', disabled: true },
                  { value: 'BTC', label: 'BTC', disabled: true },
                ]}
              />
            </Item>
            <Item label="Address" name="address">
              <Input.TextArea disabled style={{ width: 400}}/>
            </Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Comp;
