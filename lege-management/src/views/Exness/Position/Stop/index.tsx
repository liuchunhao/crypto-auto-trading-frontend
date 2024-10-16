
import { useState } from 'react';

import { Position } from "@/views/Exness/Position";

import { Button, Modal, Popconfirm, Table, message } from 'antd';
import { Form, InputNumber, Radio, Select, Space } from 'antd';

import axios from 'axios';

interface StopPositionResponse {
    ask: number;
    bid: number;
    comment: string;
    deal: number;       // deal ticket
    order: number;      // request ticket (close position)
    price: number;
    request: [];        // request parameters
    request_id: number; // request id
    retcode: number;                // 10009: request completed
    retcode_external: number;       // 0: success
    volume: number;
}

const Comp = ({position, onUpdate}: {position:Position, onUpdate?: ()=>void}) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string>();
    const [dealTicket, setDealTicket] = useState<number>();
    const [orderTicket, setOrderTicket] = useState<number>();

    const [form] = Form.useForm();
    const {Item} = Form;

    const initialValues = {
        symbol: position.symbol,
        ticket: position.ticket,
        price: position.price_open,
        price_current: position.price_current,
        volume: position.volume,
        pnl: position.profit,
        side: position.type === 'buy'? 'BUY':'SELL',             // "BUY"
    };

    const columns = [
        { title: 'Position',  dataIndex: 'ticket', key: 'ticket' },
        { title: 'Order',     dataIndex: 'order',  key: 'order' },
        { title: 'Deal',      dataIndex: 'deal',   key: 'deal' },
        { title: 'Message',   dataIndex:'msg',     key: 'msg' },
    ]

    const onConfirm = () => {
        setOpen(true);
    }

    const onCancel = () => {
        setOpen(false);
    }

    const stopPosition = async () => {
        console.info(`Position|Stop: ${position.ticket}`);

        setLoading(true);

        const api_host = import.meta.env.VITE_EXNESS_API_HOST

        const headers = {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };

        const payload = {
            ticket: position.ticket,
            volume: form.getFieldValue("volume"),
        };

        const url = `${api_host}/api/v1/exness/positions`;

        console.info(`Position|Stop: ${position.ticket} / ${form.getFieldValue("volume")}`);
        try {
            const res = await axios.put<R<StopPositionResponse>>(url, payload, { headers });
            console.log(res.data);

            setMsg(res.data.msg);
            res.data.data.deal && setDealTicket(res.data.data.deal); 
            res.data.data.order && setOrderTicket(res.data.data.order); 
            res.data.code === 0 ? message.success(`Position stopped: ${position.ticket}`) : message.error(`Position stop failed: ${position.ticket}`);
            res.data.code === 0 && onUpdate && onUpdate();
        } catch (error) {
            message.error(`Position stop failed: ${position.ticket}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Button 
                type="primary" 
                size='large' 
                onClick={onConfirm}>Stop</Button>
            <Modal 
                title="Stop Position"
                open={open}
                onCancel={onCancel} 
                onOk={()=>{}}      
                footer={[
                    <Button key="back" onClick={onCancel}>Cancel</Button>,
                    <Popconfirm
                        title="Are you sure?"
                        onConfirm={() => setTimeout(stopPosition)}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No">
                            <Button 
                                key="submit" 
                                type="primary" 
                                loading={loading} >Stop</Button>
                    </Popconfirm>
                ]}>

                <Form form={form} layout="vertical" labelAlign="left" initialValues={initialValues} >
                    <Space wrap>
                        <Item label="Symbol" name="symbol">
                            <Select
                                onChange={()=>{}}
                                options={[
                                    { value: 'BTCUSD', label: 'BTCUSD' },
                                    { value: 'ETHUSD', label: 'ETHUSD', disabled: true},
                                    { value: 'BNBUSD', label: 'BNBUSD', disabled: true },
                                ]}
                                disabled={true}
                                value={position.symbol} 
                                style={{ width: 120 }} />
                        </Item>

                        <Item label="Side" name="side">
                            <Radio.Group
                                disabled
                                value={position.type === 'buy'? 'BUY':'SELL'}
                                options={[
                                    { value: 'BUY',  label: 'BUY' },
                                    { value: 'SELL', label: 'SELL'},
                                ]}
                                onChange={()=>{}}
                                optionType="button"
                                buttonStyle="solid" />
                        </Item>

                        <Item label="Order Ticket" name="ticket">
                            <InputNumber  
                                onChange={()=> {}} 
                                style={{ width: "100%" }} 
                                value={position.ticket}
                                disabled />
                        </Item>

                        <Item label="Entry Price" name="price">
                            <InputNumber 
                                disabled
                                prefix="$" 
                                suffix="USDT" 
                                value={position.price_open}
                                style={{ width: 200}} />
                        </Item>

                        <Item label="Market Price" name="price_current">
                            <InputNumber 
                                prefix="$" 
                                suffix="USDT" 
                                style={{ width: 200}} 
                                disabled
                                value={position.price_current} />
                        </Item>

                        <Item label="Close Volume" name="volume">
                            <InputNumber 
                                placeholder={`max: ${position.volume}`}
                                max={position.volume}
                                min={0.01} 
                                step={0.01}
                                value={position.volume}
                                style={{ width: "100%" }} />
                        </Item>

                        <Item label="PnL" name="pnl">
                            <InputNumber 
                                prefix="$"
                                suffix="USDT"
                                disabled
                                placeholder='profit/loss'
                                value={position.profit}
                                style={{ width: "100%" }} />
                        </Item>
                    </Space>
                </Form>

                <Table 
                    dataSource={[ { ticket: position.ticket, order: orderTicket, deal: dealTicket, msg: msg }]} 
                    columns={columns} 
                    pagination={false} 
                    bordered={true} 
                    size="small" 
                    showHeader />

            </Modal>
        </div>
    )
}

export default Comp;