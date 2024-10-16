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
import { OrderResponse } from "@/views/Binance/Order/New";


const Comp = ({ open, selectedOrder, onCancel }: { open: boolean, selectedOrder: Order, onCancel: () => void; }) => {
  console.info(`Modify|selectedOrder: ${selectedOrder.symbol} / ${selectedOrder.orderId}`);

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order>(selectedOrder);
  const [form] = Form.useForm();  // Hook Form

  const { Item } = Form;          // extract 'Form.Item' from 'Form'

  const initialValues = {
    orderId: order.orderId,
    symbol: order.symbol,
    side: order.side,
    type: order.type,
    price: order.price,
    qty: order.origQty,
  };

  const api_host = import.meta.env.VITE_API_HOST
  const onSend = async () => {
      console.info(`Modify|onSend: ${selectedOrder.symbol} / ${selectedOrder.orderId}`);

      setLoading(true);

      const headers = {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
      };

      const payload = {
        orderId: selectedOrder.orderId,
        symbol: selectedOrder.symbol,
        side: selectedOrder.side,
        price: form.getFieldValue("price"),
        quantity: form.getFieldValue("qty")
      };

      const url = `${api_host}/futures/order`;
      const resp = await axios.put<R<OrderResponse>>(url, payload, {headers});

      const code = resp.data.code
      const msg = resp.data.msg 
      const data = resp.data.data

      if (code !== 0) {
        message.error(`Modify: ${msg}`);
      } else {
        message.success(`Modify | ${msg}: ${data.orderId}`);
      }

      setTimeout(() => {
        setLoading(false);
      }, 200)
  }

  const onChangeSymbol = async (value: string) => {
    console.info(`Modify|onChangeSymbol: ${value}`);
  };

  const onChangeType = async (value: string) => {
    console.info(`Modify|onChangeType: ${value}`);
  };

  const onChangeSide = async () => {
    const values = await form.validateFields();
    console.info(`Modify|onChangeSide: ${values.side}`);
  };
  
  useEffect(() => {
    form.setFieldsValue({ symbol: order.symbol });
    form.setFieldsValue({ orderId: order.orderId });
    form.setFieldsValue({ side: order.side });
    form.setFieldsValue({ type: order.type });

    form.setFieldsValue({ price: order.price });
    form.setFieldsValue({ qty: order.origQty });

    console.info(`Modify|useEffect: ${order.symbol}/${order.orderId}/${order.side}/${order.type}/${order.price}/${order.origQty}`);
  }, [form, order]);

  return (
    <div className={styles.box}>
      <Modal
        title="Modify Order"
        open={open}
        onCancel={onCancel}
        afterOpenChange={() => {
          setOrder(selectedOrder);
        }}
        footer={[
          <Button key="back" onClick={onCancel}>Cancel</Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading} 
            onClick={onSend} 
            danger>Send</Button>,
        ]}>

        <Form form={form} layout="vertical" labelAlign="left" initialValues={initialValues} >
          <Space wrap>

            <Item label="Order Id" name="orderId">
              <Input
                style={{ width: 250 }}
                disabled
              />
            </Item>

            <Item label="Symbol" name="symbol">
              <Select
                style={{ width: 120 }}
                onChange={onChangeSymbol}
                options={[
                  { value: 'BTCUSDT', label: 'BTCUSDT' },
                  { value: 'ETHUSDT', label: 'ETHUSDT' },
                  { value: 'BNBUSDT', label: 'BNBUSDT', disabled: true },
                ]}
                value={order.symbol}
                disabled
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
                disabled
              />
            </Item>

            <Item label="Price" name="price">
              <InputNumber 
                prefix="$" 
                suffix="USDT" 
                style={{ width: 200}} 
                />
            </Item>

            <Item label="Qty" name="qty">
              <Input/>
            </Item>

          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Comp;
