import "./module.scss"; 

import axios from 'axios';

import { 
    // useContext, 
    useEffect, 
    useState } from 'react';

import { Space, Table, Button } from 'antd';
import { ColumnsType} from 'antd/lib/table';
import { SearchOutlined } from '@ant-design/icons';

import styled from 'styled-components';

import New from './New';
import Delete from './Delete';
import Modify from './Modify';

// import { UserDataContext } from "@/App";

export interface Result {
    count: number;
    orders: Order[];
}

export interface Order {
    comment: string;                    // "",
    external_id: string;                // "",
    magic: number;                      // 0,
    position_by_id: number;             // 0,
    positoin_id: number;                // 0,
    price_current: number;              // 0,
    price_open: number;                 // 0,
    price_stoplimit: number;            // 0,
    reason: number;                     // 0,
    sl: number;                         // 0,
    state: number;                      // 0,
    symbol: string;                     // "BTCUSD",
    ticket: number;                     // 0,
    time_done: number;                  // 0,
    time_expiration: number;            // 0,
    time_setup: string;                 // "2021-08-31 14:00:00",
    time_setup_msc: string;             // "2021.08.31 14:00:00.000",
    tp: number;                         // 0,
    type: number;                       // 2,
    type_filling: number;               // 2,
    type_time: number;                  // 0,
    volume_current: number;             // 0,
    volume_initial: number;             // 0,

    // additional fields
    side: string;                       // "Buy",
    type_order_str: string;             // "Limit",
    type_filling_str: string;           // "RETURN",
    type_time_str: string;              // "GTC",
}

const StyledTable = styled((props) => <Table {...props} />)`
        && .ant-table-tbody > tr.ant-table-row:hover > td {
            background-color: rgb(109, 208, 178);; 
        }
    `;

const View = () => {                             
    console.log("Order");

    // const { serverTime, setServerTime, accountUpdate, setAccountUpdate, orderTradeUpdate, setOrderTradeUpdate } = useContext(UserDataContext)
    // const [selectedOrder, setSelectedOrder] = useState<Order>()
    // const [open, setOpen] = useState<boolean>(false)
    // const [openDelete, setOpenDelete] = useState<boolean>(false)
    // const [openModify, setOpenModify] = useState<boolean>(false)

    const [lastOrder, setLastOrder] = useState<Order>({})
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [paggination, setPaggination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
        onChange: (page, pageSize) => {
            console.log(page, pageSize)
        }
    })

    const onTableChange = (newPaggination) => {
        setPaggination(newPaggination)
    }

    const order_types = {
        0: { txt: 'Buy',             side: 'BUY',      type: 'MARKET', color: 'red' },
        1: { txt: 'Sell',            side: 'SELL',     type: 'MARKET', color: 'blue' },
        2: { txt: 'Buy Limit',       side: 'BUY',      type: 'LIMIT', color: 'red' },
        3: { txt: 'Sell Limit',      side: 'SELL',     type: 'LIMIT', color: 'blue' },
        4: { txt: 'Buy Stop',        side: 'BUY',      type: 'STOP MARKET',  color: 'red' },
        5: { txt: 'Sell Stop',       side: 'SELL',     type: 'STOP MARKET',  color: 'blue' },
        6: { txt: 'Buy Stop Limit',  side: 'BUY',      type: 'STOP LIMIT', color: 'red' },
        7: { txt: 'Sell Stop Limit', side: 'SELL',     type: 'STOP LIMIT', color: 'blue' },
        8: { txt: 'Close By',        side: 'CLOSE BY', type: 'CLOSE BY', color: 'black' },
    }

    const time_types = {
        0: 'GTC',
        1: 'DAY',
        2: 'SPECIFIED',
        3: 'SPECIFIED DAY',
    }

    const filling_types = {
        0: 'FILL OR KILL',
        1: 'IMMEDIATE OR CANCEL',
        2: 'RETURN',
    }

    const columns: ColumnsType<Order> = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
        },
        {
            title: 'Ticket',
            dataIndex: 'ticket',
        },
        {
            title: 'clientOrderId',
            dataIndex: 'clientOrderId',
            hidden: true,
        },
        {
            title: 'Side',
            dataIndex: 'type',
            render: (type: number, ) => {
                const side = order_types[type]['side'];
                const color = order_types[type]['color'];
                return <span style={{ backgroundColor: "", color: color, }}>{side}</span>;
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: (type: number, ) => {
                const _type = order_types[type]['type'];
                return _type;
            }
        },
        {
            title: 'Price',
            dataIndex: 'price_open',
            align: 'right',
            render: (value: number, ) => {
                // force all values to be 2 decimal places and add commas to separate thousands
                return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            }
        },
        {
            title: 'Volume',
            dataIndex: 'volume_initial',
            hidden: true,
        },
        {
            title: 'Volume Current',
            dataIndex: 'volume_current',
            align: 'right',
        },
        {
            title: 'Stop Limit Px',
            dataIndex: 'price_stoplimit',
            align: 'right',
        },
        {
            title: 'Stop Loss Px',
            dataIndex: 'sl',
            hidden: true,
        },
        {
            title: 'Take Profit Px',
            dataIndex: 'tp',
            hidden: true,
        },
        {
            title: 'Expiration',
            dataIndex: 'type_time',
            render: (type: number, ) => {
                const txt = time_types[type]?.toUpperCase();
                return <span>{txt}</span>;
            }   
        },
        {
            title: 'TimeInForce',
            dataIndex: 'type_filling',
            render: (value: number, ) => {
                let txt = '';
                txt = filling_types[value];
                return txt;
            }
        },
        {
            title: 'Market Price',
            dataIndex: 'price_current',
            align: 'right',
            render: (value: number, ) => {
                return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            }
        },
        {
            title: 'updateTime',
            dataIndex: 'time_setup_msc',
            align: 'left',
            // sort unix timestamp
            // sorter: (a: { updateTime: string | number | Date; }, b: { updateTime: string | number | Date; }) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
            // direction: ['ascend'],
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: string, order: Order) => {
                order.side = order_types[order.type]['side'];
                order.type_order_str = order_types[order.type]['type'];
                order.type_filling_str = filling_types[order.type_filling];
                order.type_time_str = time_types[order.type_time];
                return (
                    <Space>
                        <Delete order={order} onUpdate={getOrders}/>
                        <Modify order={order} onUpdate={getOrders}/>
                    </Space>
                )
            }
        }
    ].filter((item) => {
        return item.hidden == undefined || item.hidden === false;   // show item are not hidden and have hidden property
    });

    async function getOrders() {
        setLoading(true);
        const api_host = import.meta.env.VITE_EXNESS_API_HOST
        const headers = {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };
        const resp = await axios.get<R<Result>>(`${api_host}/api/v1/exness/order/list?symbol=BTCUSD`, { headers });
        console.log(resp.data.data);
        console.log(resp.data.data.count);
        // sort updateTime in descending order
        resp.data.data.orders.sort((a, b) => new Date(b.time_setup_msc).getTime() - new Date(a.time_setup_msc).getTime());
        setOrders(resp.data.data.orders);
        setLastOrder(resp.data.data.orders[0]);
        setLoading(false);
    }

    useEffect(() => {
        getOrders();
    }, []);
    

    return (
                <div className="Order"> 
                    <Space wrap>
                        <Button 
                            type="default"
                            size="large"
                            icon={<SearchOutlined />}
                            style={{ background: "black", color: "white" }}
                            onClick={getOrders}>Orders</Button>

                        <New order={lastOrder} onUpdate={ getOrders }/>
                    </Space>

                    <StyledTable 
                        rowClassName="table-row"
                        scroll={{ x: 100 }}
                        columns={columns} 
                        dataSource={orders} 
                        rowKey='ticket' 
                        loading={loading}
                        paggination={paggination} 
                        onChange={onTableChange}/> 
                </div>
    )
}

export default View;
    