
import { useEffect, useState } from 'react';
import { Order } from "@/views/Exness/Order";
import { Button, Modal, Popconfirm, message, Table} from 'antd';
import { Form, InputNumber, Radio, Select, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
// import { options } from 'node_modules/axios/index.d.cts';

export interface OrderResponse {
    ask: number;
    bid: number;
    comment: string;
    deal: number;
    order: number;  // ticket
    price: number;  // no use
    request: [];
    request_id: number;
    retcode: number;
    retcode_external: number;
    volume: number;

    // additional fields
    msg?: string;
}

const Comp = ({order, onUpdate}: {order:Order, onUpdate?: ()=>void}) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [orderResponse, setOrderResponse] = useState<OrderResponse[]>([]);
    // const [retMsg, setRetMsg] = useState("");

    const [form] = Form.useForm();
    const {Item} = Form;
    const [priceHidden, setPriceHidden] = useState(false);
    const [fillingType, setFillingType] = useState("RETURN");

    /*
        const order_types = {
            'BUY':  { 'MARKET': 0, 'LIMIT': 2, 'STOP MARKET': 4, 'STOP LIMIT': 6, 'CLOSE BY': 8 } ,
            'SELL': { 'MARKET': 1, 'LIMIT': 3, 'STOP MARKET': 5, 'STOP LIMIT': 7, 'CLOSE BY': 8 },
        }

        const time_types = {
            'GTC': 0,
            'DAY': 1,
            'SPECIFIED': 2,
            'SPECIFIED DAY': 3,
        }

        const filling_types = {
            'FILL OR KILL': 0,
            'IMMEDIATE OR CANCEL': 1,
            'RETURN': 2,
        }
    */

    const columns: ColumnsType<OrderResponse> = [
        { title: 'Ticket',  dataIndex: 'order' },
        { title: 'Message', dataIndex: 'msg' },
    ];

    const initialValues = {
        symbol: order.symbol,
        ticket: "",
        // type: order.type,
        price: order.price_current,
        price_current: order.price_current,
        volume: order.volume_current,

        // displayed fields
        side: "BUY",
        type_order: "LIMIT",       
        type_filling: "RETURN",
        type_time: "GTC",      
    };

    const onTypeChange = (value: string) => {
        console.log(`Order|Type: ${value}`);
        switch (value) {
            case "MARKET":
                setFillingType("IOC")
                setPriceHidden(true)
                break;
            case "LIMIT":
                setFillingType("RETURN")
                setPriceHidden(false)
                break;
            case "STOP LIMIT":
                setPriceHidden(false)
                break;
            case "STOP MARKET":
                setPriceHidden(false)
                break;
            default:
                break;
        }
    }

    const onConfirm = () => {
        setOpen(true);
        setOrderResponse([]);
    }

    const onCancel = () => {
        setOpen(false);
    }

    const modifyOrder = async () => {
        console.info(`Order|New:`);  

        setLoading(true);

        const api_host = import.meta.env.VITE_EXNESS_API_HOST

        const headers = {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };

        const payload = {
            symbol: form.getFieldValue("symbol"),
            order_type: form.getFieldValue("side").toLowerCase(),
            volume: form.getFieldValue("volume"),
        };

        let url = "";
        if (form.getFieldValue("type_order") === "LIMIT") {
            url = `${api_host}/api/v1/exness/order/limit`
            payload['price'] = form.getFieldValue("price")  
        } else {
            url = `${api_host}/api/v1/exness/order/market`
        }

        console.info(`Order|New: url: ${url} / ${payload}`)

        try {
            const res = await axios.post<R<OrderResponse>>(url, payload, { headers })
            console.log(res.data.data);

            // res.data.msg && setRetMsg(res.data.msg);
            res.data.code === 0 && onUpdate && onUpdate() 
            res.data.data.msg = res.data.msg;
            res.data.code === 0 && setOrderResponse([res.data.data]);
            (res.data.code === 0 && res.data.data.order) && message.success(`Order placed: ${res.data.data.order}`);
            (res.data.code === 0 && res.data.data.deal) && message.success(`Order dealed: ${res.data.data.deal}`);
            res.data.code !== 0 && message.error(`Order placed failed: ${res.data.msg}`);

        } catch (error) {
            message.error(`Order placed failed: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

    }, [])

    return (
        <div>
            <Button 
                type="primary" 
                size='large' 
                style={{ background: "#52c41a", borderColor: "#52c41a"}}
                onClick={onConfirm}>New</Button>
            <Modal 
                title="New Order"
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
                                loading={loading} >New</Button>
                    </Popconfirm>
                ]}>

                <Form form={form} layout="vertical" labelAlign="left" initialValues={initialValues} >
                    <Space wrap>
                        <Item label="Symbol" name="symbol">
                            <Select
                                onChange={()=>{}}
                                value={order.symbol} 
                                options={[
                                    { value: 'BTCUSD', label: 'BTCUSD' },
                                    { value: 'ETHUSD', label: 'ETHUSD', disabled: true},
                                    { value: 'BNBUSD', label: 'BNBUSD', disabled: true },
                                ]}
                                style={{ width: 120 }} />
                        </Item>

                        <Item label="Side" name="side">
                            <Radio.Group
                                options={[
                                    { value: 'BUY',  label: 'BUY' },
                                    { value: 'SELL', label: 'SELL'},
                                ]}
                                onChange={()=>{}}
                                style={{ display: "flex"}}
                                optionType="button"
                                buttonStyle="solid" />
                        </Item>

                        <Item label="Type" name="type_order">
                            <Select
                                style={{ width: 150 }}
                                onChange={onTypeChange}
                                options={[
                                    { value: 'MARKET',      label: 'MARKET' },
                                    { value: 'LIMIT',       label: 'LIMIT'  },
                                    { value: 'STOP LIMIT',  label: 'STOP LIMIT',  disabled: true  },
                                    { value: 'STOP MARKET', label: 'STOP MARKET', disabled: true },
                                ]} />
                        </Item>

                        <Item label="Filling Type" name="type_filling" hidden>
                            <Radio.Group
                                style={{ width: "100%" }}
                                value={fillingType}
                                options={[
                                    { value: 'RETURN',  label: 'RETURN' },
                                    { value: 'IOC',     label: 'IOC', },
                                    { value: 'FOK',     label: 'FOK', disabled: true},
                                ]}
                                optionType="button"
                                buttonStyle="solid" 
                                />
                        </Item>

                        <Item label="Type" name="type_time">
                            <Select
                                style={{ width: 150 }}
                                onChange={()=>{}}
                                options={[
                                    { value: 'GTC',  label: 'GTC' },
                                    { value: 'DAY',  label: 'DAY', disabled: true},
                                    { value: 'SPECIFIED',  label: 'SPECIFIED', disabled: true},
                                    { value: 'SPECIFIED DAY',  label: 'SPECIFIED DAY', disabled: true},
                                ]} />
                        </Item>

                        <Item label="Volume" name="volume">
                            <InputNumber
                                style={{ width: 120 }}
                                min={0.01} 
                                step={0.01}
                                suffix="BTC" />
                        </Item>
                        <Item label="Price" name="price" hidden={priceHidden}>
                            <InputNumber 
                                prefix="$" 
                                suffix="USDT" 
                                step={1}
                                value={order.price_open}
                                style={{ width: 180}} />
                        </Item>


                        <Item label="Market Price" name="price_current" hidden >
                            <InputNumber 
                                disabled
                                prefix="$" 
                                suffix="USDT" 
                                value={order.price_current} 
                                style={{ width: 250}} />
                        </Item>

                    </Space>
                </Form>

                <Table 
                    pagination={false}
                    dataSource={orderResponse} 
                    columns={columns} />

            </Modal>
        </div>
    )
}

export default Comp;