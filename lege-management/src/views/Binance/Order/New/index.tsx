import styles from "./spot.module.scss";

import {
  Radio,
  InputNumber,
  Popconfirm,
  Button,
  Modal,
  Form,
  Space,
  Select,
  message,
} from "antd";

// import { RadioChangeEvent } from "antd/lib/radio";

import axios from "axios";

import { useEffect, useState } from "react";

export interface OrderResponse {
  avgPrice: number;             // "0.00",
  clientOrderId: string;        // "WtlH6EopTteaKrn7GcZoKH",
  closePosition: boolean;       // false,
  cumQty: number;               // "0.000",
  cumQuote: number;             // "0.00000",
  executedQty: number;          // "0.000",
  goodTillDate: number;         // 0,
  orderId: number;              // 208034812317,
  origQty: number;              // "0.000",
  origType: string;             // "LIMIT", 
  positionSide: string;         // "BOTH",
  price: string;                // "0.00",
  priceMatch: string;           // "NONE",
  priceProtect: boolean;        // false,
  reduceOnly: boolean;              // false,
  selfTradePreventionMode: string;  // "NONE",
  side: string;                 // "SELL",
  status: string;               // "NEW",
  stopPrice: string;            // "0.00",
  symbol: string;               // "BTCUSDT",
  timeInForce: string;          // "GTC",
  type: string;                 // "LIMIT",
  updateTime: EpochTimeStamp;   // 1699399215457,
  workingType: string;          // "CONTRACT_PRICE"
}

const Comp = ({ open, onCancel }: { open?: boolean, onCancel?: () => void; }) => {
  console.log("New");

  const [loading, setLoading] = useState(false);
  const [showPrice, setShowPrice] = useState<boolean>(true);
  const [showStopPrice, setShowStopPrice] = useState<boolean>(false);

  const { Item } = Form;          // extract 'Form.Item' from 'Form'

  const [form] = Form.useForm();  // To achieve 'Form' data

  const initialValues = {
    symbol: "BTCUSDT",
    side: "BUY",
    lastPrice: 0.0,
    type: "LIMIT",
    price: undefined,
    qty: 0.00,
    cost: 0.00,
    orderId: undefined,
  };

  type Payload = {
    symbol: string;
    side: string;
    quantity: number;
    price?: number;    // Make this property optional
    stopPrice?: number;
    timeInForce?: string;
  };

  const api_host = import.meta.env.VITE_API_HOST
  const onSend = async () => {
      setLoading(true);

      const values = await form.validateFields(); 
      console.info(`Send: ${values.symbol}/${values.side}/${values.type}`);

      const headers = {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
      };

      const handleResponse = (resp: R<OrderResponse>) => {
        const code = resp.code
        const msg = resp.msg 
        const data = resp.data

        if (code !== 0) {
          message.error(`${msg}`);
        } else {
          message.success(`NEW | ${msg}: ${data.orderId}`);
          form.setFieldsValue({ orderId: data.orderId });
        }
      }

      const type = form.getFieldValue("type")
      let payload: Payload;
      let resp: R<OrderResponse>;

      switch (type) {
        case "LIMIT":
          payload = {
            symbol: values.symbol,
            side: values.side,
            quantity: values.qty,
            price: values.price,
          };
          resp = (await axios.post<R<OrderResponse>>(`${api_host}/futures/limitOrder`, payload, { headers })).data;
          handleResponse(resp)
          break;

        case "MARKET":
          payload = {
            symbol: values.symbol,
            side: values.side,
            quantity: values.qty,
          };
          resp = (await axios.post<R<OrderResponse>>(`${api_host}/futures/marketOrder`, payload, { headers })).data;
          handleResponse(resp)
          break;
          
        case "STOP":
          payload = {
            symbol: values.symbol,
            side: values.side,
            quantity: values.qty,
            stopPrice: values.stopPrice,
            price: values.price,
          };
          resp = (await axios.post<R<OrderResponse>>(`${api_host}/futures/stopLimitOrder`, payload, { headers })).data;
          handleResponse(resp)
          break;

        case "STOP_MARKET":
          payload = {
            symbol: values.symbol,
            side: values.side,
            quantity: values.qty,
            stopPrice: values.stopPrice,
          };
          resp = (await axios.post<R<OrderResponse>>(`${api_host}/futures/stopMarketOrder`, payload, { headers })).data;
          handleResponse(resp)
          break;

        default:
          message.error(`Invalid type: ${type}`);
          return;
      }

      setTimeout(() => {
        setLoading(false);
      }, 500)
  }

  const onChangeSymbol = async (value: string) => {
    console.info(`selected ${value}`);
  };

  const onChangeType = async (value: string) => {
    console.info(`selected ${value}`);
    switch (value) {
      case "LIMIT":
        setShowPrice(true);
        setShowStopPrice(false);
        break;
      case "MARKET":
        setShowPrice(false);
        setShowStopPrice(false);
        break;
      case "STOP":
        setShowPrice(true);
        setShowStopPrice(true);
        break;
      case "STOP_MARKET":
        setShowPrice(false);
        setShowStopPrice(true);
        break;
      default:
        setShowPrice(false);
        setShowStopPrice(false);
        break;
    }
  };

  const onChangeSide = async () => {
    const values = await form.validateFields();
    console.info(`selected ${values.side}`);
  };
  

  useEffect(() => {

  }, []);


  return (
    <div className={styles.box}>
      <Modal
        title="New Order"
        open={open}
        onCancel={onCancel}
        onOk={()=>{ console.info("onOk") } }
        footer={[
          <Button key="back" size="large" onClick={onCancel}>Cancel</Button>,
          <Popconfirm
            title="Are you sure?"
            onConfirm={onSend}
            onCancel={() => { console.info("onCancel")}}
            okText="Yes"
            cancelText="No">
            <Button key="submit" size="large" type="primary" loading={loading}> Send </Button>
          </Popconfirm>
        ]}>

        <Form form={form} layout="vertical" labelAlign="left" initialValues={initialValues} >
          <Space wrap>
            <Item label="Symbol" name="symbol">
              <Select
                style={{ width: 120 }}
                onChange={onChangeSymbol}
                options={[
                  { value: 'BTCUSDT', label: 'BTCUSDT' },
                  { value: 'ETHUSDT', label: 'ETHUSDT' },
                  { value: 'BNBUSDT', label: 'BNBUSDT', disabled: true },
                ]}
              />
            </Item>

            <Item label="Side" name="side">
              <Radio.Group
                options={[
                  { value: 'BUY',  label: 'BUY' },
                  { value: 'SELL', label: 'SELL'},
                ]}
                onChange={onChangeSide}
                optionType="button"
                buttonStyle="solid"
              />
            </Item>

            <Item label="Type" name="type">
              <Select
                style={{ width: 150 }}
                onChange={onChangeType}
                options={[
                  { value: 'LIMIT',       label: 'LIMIT' },
                  { value: 'MARKET',      label: 'MARKET'},
                  { value: 'STOP',        label: 'STOP' },
                  { value: 'STOP_MARKET', label: 'STOP_MARKET'},
                ]}
              />
            </Item>

            { showStopPrice &&
              <Item label="Stop Price" name="stopPrice">
                  <InputNumber 
                    prefix="$"
                    suffix="USDT"
                    min={0}
                    style={{ width: 200}}/>
              </Item>
            }

            <Space wrap>
                <Item label="Qty" name="qty">
                  <InputNumber
                    min={0}
                    style={{ width: 200}}/>
                </Item>

                { showPrice &&
                  <Item label="Price" name="price">
                    <InputNumber 
                      prefix="$"
                      suffix="USDT"
                      min={0}
                      style={{ width: 200}}/>
                  </Item>
                }
            </Space>

            <Space wrap>
              <Item label="Order Id" name="orderId">
                <InputNumber 
                  disabled 
                  style={{ width: 410 }}/>
              </Item>
              <Item label="Cost" name="cost">
                <InputNumber 
                  disabled 
                  prefix={"$"}
                  suffix={"USDT"}
                  style={{ width: 200}}/>
              </Item>

              <Item label="Last Price" name="lastPrice">
                <InputNumber 
                  disabled 
                  prefix={"$"}
                  suffix={"USDT"}
                  style={{ width: 200}}/>
              </Item>
            </Space>


          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Comp;
