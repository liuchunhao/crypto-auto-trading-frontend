
import { useState } from 'react';
import { Order } from "@/views/Exness/Order";
import { Button, Modal, Popconfirm, message } from 'antd';
import { Form, Input, InputNumber, Radio, Select, Space } from 'antd';
import axios from 'axios';

const Comp = ({order, onUpdate}: {order:Order, onUpdate?: ()=>void}) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();
    const {Item} = Form;

    const initialValues = {
        symbol: order.symbol,
        ticket: order.ticket,
        type: order.type,
        price: order.price_open,
        price_current: order.price_current,
        volume: order.volume_current,

        // displayed fields
        side: order.side,                       // "BUY"
        type_order: order.type_order_str,       // "LIMIT"
        type_filling: order.type_filling_str,   // "GTC"
        type_time: order.type_time_str,         // "GTC"
    };

    const onConfirm = () => {
        setOpen(true);
    }

    const onCancel = () => {
        setOpen(false);
    }

    const modifyOrder = async () => {
        console.info(`Order|Delete: ${order.ticket}`);
        setLoading(true);

        const api_host = import.meta.env.VITE_EXNESS_API_HOST

        const headers = {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };

        const payload = {
            ticket: order.ticket,
            price: form.getFieldValue("price")
        };

        const url = `${api_host}/api/v1/exness/order`;

        console.info(`Order|Modify: ${order.ticket} / ${form.getFieldValue("price")}`);
        try {
            const res = await axios.put(url, payload, { headers });
            console.log(res.data);
            res.data.code === 0 ? message.success(`Order modified: ${order.ticket}`) : message.error(`Order modify failed: ${order.ticket}`);
            res.data.code === 0 && onUpdate && onUpdate();

        } catch (error) {
            message.error(`Order modify failed: ${order.ticket}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Button 
                type="primary" 
                size='large' 
                onClick={onConfirm}>Modify</Button>
            <Modal 
                title="Modify Order"
                open={open}
                onCancel={onCancel} 
                onOk={()=>{}}      
                footer={[
                    <Button key="back" onClick={onCancel}>Cancel</Button>,
                    <Popconfirm
                        title="Are you sure?"
                        onConfirm={() => setTimeout(modifyOrder)}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No">
                            <Button 
                                key="submit" 
                                type="primary" 
                                loading={loading} >Modify</Button>
                    </Popconfirm>
                ]}>

                <Form form={form} layout="vertical" labelAlign="left" initialValues={initialValues} >
                    <Space wrap>
                        <Item label="Symbol" name="symbol">
                            <Select
                                style={{ width: 120 }}
                                onChange={()=>{}}
                                options={[
                                    { value: 'BTCUSD', label: 'BTCUSD' },
                                    { value: 'ETHUSD', label: 'ETHUSD', disabled: true},
                                    { value: 'BNBUSD', label: 'BNBUSD', disabled: true },
                                ]}
                                disabled={true}
                                value={order.symbol} />
                        </Item>

                        <Item label="Side" name="side">
                            <Radio.Group
                                disabled
                                options={[
                                    { value: 'BUY',  label: 'BUY' },
                                    { value: 'SELL', label: 'SELL'},
                                ]}
                                onChange={()=>{}}
                                optionType="button"
                                buttonStyle="solid" />
                        </Item>

                        <Item label="Type" name="type_order">
                            <Select
                                style={{ width: 150 }}
                                onChange={()=>{}}
                                options={[
                                    { value: 'MARKET',      label: 'MARKET'},
                                    { value: 'LIMIT',       label: 'LIMIT' },
                                    { value: 'STOP LIMIT',  label: 'STOP LIMIT'},
                                    { value: 'STOP MARKET', label: 'STOP MARKET'},
                                ]}
                                disabled/>
                        </Item>

                        <Item label="Side" name="type_filling">
                            <Radio.Group
                                disabled
                                options={[
                                    { value: 'RETURN',  label: 'RETURN' },
                                    { value: 'IOC',     label: 'IOC'},
                                    { value: 'FOK',     label: 'FOK'},
                                ]}
                                onChange={()=>{}}
                                optionType="button"
                                buttonStyle="solid" />
                        </Item>

                        <Item label="Type" name="type_time">
                            <Select
                                style={{ width: 150 }}
                                onChange={()=>{}}
                                options={[
                                    { value: 'GTC',  label: 'GTC' },
                                    { value: 'DAY',  label: 'DAY'},
                                    { value: 'SPECIFIED',  label: 'SPECIFIED'},
                                    { value: 'SPECIFIED DAY',  label: 'SPECIFIED DAY'},
                                ]}
                                disabled/>
                        </Item>

                        <Item label="Volume" name="volume">
                            <Input disabled />
                        </Item>

                        <Item label="Order Ticket" name="ticket">
                            <InputNumber  
                                onChange={()=> {}} 
                                style={{ width: "100%" }} 
                                value={order.ticket}
                                disabled />
                        </Item>

                        <Item label="Market Price" name="price_current">
                            <InputNumber 
                                prefix="$" 
                                suffix="USDT" 
                                style={{ width: 200}} 
                                disabled
                                value={order.price_current} />
                        </Item>

                        <Item label="Price" name="price">
                            <InputNumber 
                                prefix="$" 
                                suffix="USDT" 
                                style={{ width: 200}} />
                        </Item>

                    </Space>
                </Form>
            </Modal>
        </div>
    )
}

export default Comp;