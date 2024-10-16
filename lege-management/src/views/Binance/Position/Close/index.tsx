import styles from "./spot.module.scss";

import {
  Popconfirm,
  Radio,
  InputNumber,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Select,
  message,
} from "antd";

import axios from "axios";

import { useEffect, useState } from "react";

import { OrderResponse } from "@/views/Binance/Order/New";
import { Position } from "@/views/Binance/Position";

const Comp = ({ selected }: { selected: Position }) => {
  console.info(`Close|selected: ${selected.symbol} / ${selected.positionSide}`);

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [showPrice, setShowPrice] = useState<boolean>(true);

  const [form] = Form.useForm();  

  const { Item } = Form;          // extract 'Form.Item' from 'Form'

  const initialValues = {
    symbol: "BTCUSDT",
    side: "BUY",
    type: "LIMIT",
    price: "0.00",
    qty: "0.000",
  };

  type Payload = {
    symbol: string;
    side: string;
    type: string;
    quantity: number;
    price?: number;    // Make this property optional
  };


  const api_host = import.meta.env.VITE_API_HOST
  const onSend = async () => {
      console.info(`Close|onSend: ${selected.symbol} / ${selected.positionSide}`);

      setLoading(true);

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
          message.error(`Close: ${msg}`);
        } else {
          message.success(`Close: ${msg} / ${data.orderId}`);
          form.setFieldValue("orderId", data.orderId);
        }
      }

      let url: string;
      let payload: Payload;
      let resp: R<OrderResponse>;

      const type = form.getFieldValue("type")
      switch (type) {
        case "LIMIT":
          payload = {
            symbol: form.getFieldValue("symbol"),
            type: form.getFieldValue("type"),
            side: form.getFieldValue("side"),
            quantity: form.getFieldValue("qty"),
            price: form.getFieldValue("price"),
          };

          url = `${api_host}/futures/limitOrder`;
          resp = (await axios.post<R<OrderResponse>>(url, payload, {headers})).data;
          handleResponse(resp)
          break;

        case "MARKET":
          payload = {
            symbol: form.getFieldValue("symbol"),
            type: form.getFieldValue("type"),
            side: form.getFieldValue("side"),
            quantity: form.getFieldValue("qty"),
          };

          url = `${api_host}/futures/marketOrder`;
          resp = (await axios.post<R<OrderResponse>>(url, payload, {headers})).data;
          handleResponse(resp)
          break;

        default:
          message.error(`Close: ${type} is not supported`);
          break;
      }

      setTimeout(() => {
        setLoading(false);
      }, 200)
  }

  const onClick = () => {
    setOpen(true);
  }

  const onCancel = () => {
    setOpen(false);
  }

  const onChangeSymbol = async (value: string) => {
    console.info(`selected ${value}`);
  };

  const onChangeType = async (value: string) => {
    console.info(`selected ${value}`);
    setShowPrice(value === "LIMIT");
  };

  const onChangeSide = async () => {
    const values = await form.validateFields();
    message.success(`selected ${values.side}`);
  };
  
  useEffect(() => {
    console.info(`Close|useEffect`);

  }, []);

  return (
    <div>

      <Button
        danger
        type="primary"
        size="large"
        onClick={onClick}>Close</Button>

      <Modal
        title="Close Position"
        open={open}
        onCancel={onCancel}
        afterOpenChange={() => {
          form.setFieldValue("symbol", selected.symbol);
          form.setFieldValue("side", selected.positionAmt > 0 ? "SELL" : "BUY");
          form.setFieldValue("qty", Math.abs(selected.positionAmt));     // absolute value
          form.setFieldValue("price", Math.round(selected.markPrice));
        }}
        footer={[
          <Button type="primary" key="back" onClick={onCancel}>Cancel</Button>,

          <Popconfirm
            title="Are you sure?"
            onConfirm={onSend} >
            <Button 
              key="submit" 
              type="primary" 
              loading={loading} 
              danger>Send</Button>
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
                disabled={true}
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
                disabled
              />
            </Item>

            <Space wrap>
            <Item label="Type" name="type">
              <Select
                style={{ width: 150 }}
                onChange={onChangeType}
                options={[
                  { value: 'LIMIT',       label: 'LIMIT' },
                  { value: 'MARKET',      label: 'MARKET'},
                ]}
              />
            </Item>

            <Item label="Qty" name="qty">
              <InputNumber 
                style={{ width: 200}} />
            </Item>

            { showPrice &&
              <Item label="Price" name="price">
                <InputNumber 
                  prefix="$" 
                  suffix="USDT" 
                  style={{ width: 200}} />
              </Item> }
            </Space>

            <Item label="Order ID" name="orderId">
              <Input 
                disabled
                style={{ width: 200}} />
            </Item>

          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Comp;
