import styles from "./spot.module.scss";

import {
  Popconfirm,
  Radio,
  InputNumber,
  Button,
  Modal,
  Form,
  Space,
  Select,
  message,
} from "antd";

import axios from "axios";

import { useEffect, useState } from "react";

import { Position } from "@/views/Binance/Position";
import { OrderResponse } from "../../Order/New";

const Comp = ({ selected }: { selected: Position } ) => {
  // message.info(`Stop: ${selected.symbol} / ${selected.positionSide}`);

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<Position>(selected);
  const [showPrice, setShowPrice] = useState<boolean>(true);

  const [form] = Form.useForm();  // Hook Form

  const { Item } = Form;          // extract 'Form.Item' from 'Form'

  const initialValues = {
    symbol: position.symbol,
    side: "BUY",
    type: "STOP",
    qty: 0.0,
    stopPrice: 0.0,
    price: 0.0,
  };

  type Payload = {
    symbol: string;
    side: string;
    type: string;
    quantity: number;
    stopPrice: number;
    price?: number;    // Make this property optional
  };

  const api_host = import.meta.env.VITE_API_HOST
  const onSend = async () => {

      setLoading(true);

      let url: string;

      const headers = {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      };

      let payload: Payload;
      const type = form.getFieldValue("type")
      switch (type) {
        case "STOP":
          url = `${api_host}/futures/stopLimitOrder`
          payload = {
            symbol: form.getFieldValue("symbol"),
            side: form.getFieldValue("side"),
            type: form.getFieldValue("type"),
            quantity: form.getFieldValue("qty"),
            stopPrice: form.getFieldValue("stopPrice"),
            price: form.getFieldValue("price"),
          };
          console.info(`Stop|onSend: ${payload.symbol} / ${payload.side} / ${payload.type} / qty: ${payload.quantity} / stopPrice: ${payload.stopPrice} / price: ${payload.price}`);
          break;

        case "STOP_MARKET":
          url = `${api_host}/futures/stopMarketOrder`
          payload = {
            symbol: form.getFieldValue("symbol"),
            side: form.getFieldValue("side"),
            type: form.getFieldValue("type"),
            quantity: form.getFieldValue("qty"),
            stopPrice: form.getFieldValue("stopPrice"),
          };
          console.info(`Stop|onSend: ${payload.symbol} / ${payload.side} / ${payload.type} / qty: ${payload.quantity} / stopPrice: ${payload.stopPrice} / price: ${payload.price}`);
          break;
        default:
          message.error(`Invalid type: ${type}`);
          return;
      }

      const resp = await axios.post<R<OrderResponse>>(url, payload, {headers});

      const code = resp.data.code
      const msg = resp.data.msg 
      const data = resp.data.data

      if (code !== 0) {
        message.error(`Stop: ${msg}`);
      } else {
        message.success(`Stop: ${msg} / ${data.orderId}`);
      }

      setTimeout(() => {
        setLoading(false);
      }, 200)
  }

  const onClick = () => {
    console.info(`Stop|onClick`);
    setOpen(true);
    setPosition(selected);
  }

  const onCancel = () => {
    console.info(`Stop|onCancel`);
    setOpen(false);
  }

  const onChangeSymbol = async (value: string) => {
    console.info(`onChangeSymbol: ${value}`);
  };

  const onChangeType = async (value: string) => {
    console.info(`Stop|onChangeType: ${value}`);
    // 'Price' not visible when type is 'STOP_LIMIT'
    setShowPrice(value === "STOP") 
  };

  const onChangeSide = async () => {
    const values = await form.validateFields();
    console.info(`Stop|onChangeSide: ${values.side}`);
  };
  
  useEffect(() => {
    const symbol = position.symbol;
    const side = position.positionAmt > 0 ? "SELL" : "BUY";

    const qty = Math.abs(position.positionAmt);     // absolute value 
    const stopPrice = position.markPrice;
    const price = position.markPrice;

    form.setFieldValue("symbol", symbol);
    form.setFieldValue("side", side);
    form.setFieldValue("entryPrice", position.entryPrice);
    form.setFieldValue("markPrice", position.markPrice);

    form.setFieldValue("qty", qty);
    form.setFieldValue("stopPrice", stopPrice);
    form.setFieldValue("price", price);

    console.info(`Stop|useEffect: ${position.symbol} / ${side} / ${qty}`);
  }, [position, form]);

  return (
    <div>
      <Button 
        type="primary" 
        size="large"
        style={{ }}
        onClick={onClick} 
        >Stop</Button>

      <Modal
        title="Stop Position"
        open={open}
        onCancel={onCancel}
        afterOpenChange={() => {
          setPosition(position);
        }}
        footer={[
            <Button key="back" onClick={onCancel}>Cancel</Button>,
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
                value={position.symbol}
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

            <Item label="Entry Price" name="entryPrice">
              <InputNumber 
                disabled
                prefix="$" 
                suffix="USDT" 
                style={{ width: 400}} 
                />
            </Item>

            <Item label="Mark Price" name="markPrice">
              <InputNumber 
                disabled
                prefix="$" 
                suffix="USDT" 
                style={{ width: 400}} 
                />
            </Item>


            <Item label="Type" name="type">
              <Select
                style={{ width: 150 }}
                onChange={onChangeType}
                options={[
                  { value: 'STOP',        label: 'STOP'},
                  { value: 'STOP_MARKET', label: 'STOP_MARKET'},
                ]}
              />
            </Item>

            <Item label="Qty" name="qty">
              <InputNumber 
                style={{ width: 150 }}
                max={Math.abs(position.positionAmt)}
                min={0.0}
              />
            </Item>

            <Item label="Stop Price" name="stopPrice">
              <InputNumber 
                prefix="$" 
                suffix="USDT" 
                style={{ width: 200}} 
                min={0.0}
                />
            </Item>
            
            {showPrice && (
              <Item label="Price" name="price">
                <InputNumber 
                  prefix="$" 
                  suffix="USDT" 
                  style={{ width: 200}} 
                  min={0.0}
                  />
              </Item>
            )}

          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Comp;
