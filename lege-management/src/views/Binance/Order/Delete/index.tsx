import styles from "./spot.module.scss";

import {
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

import { Order } from "@/views/Binance/Order";

interface OrderDeleteResponse {
  avgPrice: number;                 // "0.00",
  clientOrderId: string;            // "WtlH6EopTteaKrn7GcZoKH",
  closePosition: boolean;           // false,
  cumQty: number;                   // "0.000",
  cumQuote: number;                 // "0.00000",
  executedQty: number;              // "0.000",
  goodTillDate: number;             // 0,
  orderId: string;                  // 208034812317,
  origQty: number;                  // "0.000",
  origType: string;                 // "LIMIT", 
  positionSide: string;             // "BOTH",
  price: string;                    // "0.00",
  priceMatch: string;               // "NONE",
  priceProtect: boolean;            // false,
  reduceOnly: boolean;              // false,
  selfTradePreventionMode: string;  // "NONE",
  side: string;                     // "SELL",
  status: string;                   // "NEW",
  stopPrice: string;                // "0.00",
  symbol: string;                   // "BTCUSDT",
  timeInForce: string;              // "GTC",
  type: string;                     // "LIMIT",
  updateTime: EpochTimeStamp;       // 1699399215457,
  workingType: string;              // "CONTRACT_PRICE"
}

const Comp = ({ open, selectedOrder, onCancel }: { open: boolean, selectedOrder: Order, onCancel: () => void; }) => {
  console.info(`Delete|selectedOrder: ${selectedOrder.symbol} / ${selectedOrder.orderId}`); 

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order>(selectedOrder);
  const [form] = Form.useForm();  // Hook Form

  const { Item } = Form;          // extract 'Form.Item' from 'Form'

  const initialValues = {
    symbol: order.symbol,
    side: order.side,
    type: order.type,
    price: order.price,
    qty: order.origQty,
    orderId: order.orderId,
    lastPrice: 0.0,
    cost: 0.00,
  };

  const api_host = import.meta.env.VITE_API_HOST
  const onSend = async () => {
      console.info(`Delete|onDelete: ${selectedOrder.symbol} / ${selectedOrder.orderId}`);

      setLoading(true);

      const headers = {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
      };

      const payload = {
        symbol: selectedOrder.symbol,
        orderId: selectedOrder.orderId+"",
      };

      const resp = await axios.delete<R<OrderDeleteResponse>>(`${api_host}/futures/order`, {headers, data: payload});

      const code = resp.data.code
      const msg = resp.data.msg 
      const data = resp.data.data

      if (code !== 0) {
        message.error(`Delete: ${msg}`);
      } else {
        message.success(`Delete | ${msg}: ${data.orderId}`);
      }

      setTimeout(() => {
        setLoading(false);
      }, 200)
  }

  const onChangeSymbol = async (value: string) => {
    console.info(`Delete|onChangeSymbol: ${value}`);
  };

  const onChangeType = async (value: string) => {
    console.info(`Delete|onChangeType: ${value}`);
  };

  const onChangeSide = async () => {
    const values = await form.validateFields();
    console.info(`Delete|onChangeSide: ${values.side}`);
  };

  const onChangeOrderId = (value: string | null) => {
    console.info(`Delete|onChangeOrderId: ${value}`);
  }
  
  useEffect(() => {
    form.setFieldsValue({ symbol: order.symbol });
    form.setFieldsValue({ orderId: order.orderId });
    form.setFieldsValue({ side: order.side });
    form.setFieldsValue({ type: order.type });
    form.setFieldsValue({ price: order.price });
    form.setFieldsValue({ qty: order.origQty });

    console.info(`Delete/useEffect: ${order.symbol}/${order.orderId}/${order.side}/${order.type}/${order.price}/${order.origQty}`);
  }, [form, order]);

  return (
    <div className={styles.box}>
      <Modal
        title="Cancel Order"
        open={open}
        onCancel={onCancel}
        afterOpenChange={() => {
          setOrder(selectedOrder);
        }}
        footer={[
          <Button key="back" onClick={onCancel}>Cancel</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={onSend} danger>Delete</Button>,
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
                value={order.symbol}
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
                  { value: 'STOP',        label: 'STOP'},
                  { value: 'STOP_MARKET', label: 'STOP_MARKET'},
                ]}
                disabled={true}
              />
            </Item>

            <Item label="Price" name="price">
              <InputNumber 
              prefix="$" 
              suffix="USDT" 
              style={{ width: 200}} 
              disabled/>
            </Item>

            <Item label="Qty" name="qty">
              <Input disabled />
            </Item>

            <Item label="Order Id" name="orderId">
              <InputNumber  
                onChange={onChangeOrderId} 
                style={{ width: "100%"}} 
                value={order.orderId}
                disabled />
            </Item>

          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Comp;
