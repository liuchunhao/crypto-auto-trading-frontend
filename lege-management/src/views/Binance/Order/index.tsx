import "./module.scss"; 

import axios from 'axios';

import { useContext, useEffect, useState } from 'react';

import { Space, Table, Button } from 'antd';
import { ColumnsType} from 'antd/lib/table';
import { SearchOutlined } from '@ant-design/icons';

import styled from 'styled-components';

import NewOrder from './New';
import Delete from './Delete';
import Modify from './Modify';

import { UserDataContext } from "@/App";

export interface Order {
    avgPrice: number;                   // "0",
    clientOrderId: string;              // "WtlH6EopTteaKrn7GcZoKH",
    closePosition: boolean;             // false,
    cumQuote: number;                   // "0.00000",
    executedQty: number;                // "0",
    goodTillDate: number;               // 0,
    orderId: string;                    // 8389765627149008000,
    origQty: number;                    // "1",
    origType: string;                   // "LIMIT",
    positionSide: string;               // "BOTH",
    price: number;                      // "80000",
    priceMatch: string;                 // "NONE",
    priceProtect: boolean;              // false,
    reduceOnly: boolean;                // false,
    selfTradePreventionMode: string;    // "NONE",
    side: string;                       // "SELL",
    status: string;                     // "NEW",
    stopPrice: number;                  // "0",
    symbol: string;                     // "BTCUSDT",
    time: EpochTimeStamp;               // 1699399215457,
    timeInForce: string;                // "GTC",
    type: string;                       // "LIMIT",
    updateTime: EpochTimeStamp;         // 1699399215457,
    workingType: string;                // "CONTRACT_PRICE"
}

const StyledTable = styled((props) => <Table {...props} />)`
        && .ant-table-tbody > tr.ant-table-row:hover > td {
            background-color: rgb(109, 208, 178);; 
        }
    `;

const View = () => {                             
    console.log("Order");
    const { serverTime, setServerTime, accountUpdate, setAccountUpdate, orderTradeUpdate, setOrderTradeUpdate } = useContext(UserDataContext)
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedOrder, setSelectedOrder] = useState<Order>()
    const [open, setOpen] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [openModify, setOpenModify] = useState<boolean>(false)
    const [paggination, setPaggination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        onChange: (page, pageSize) => {
            console.log(page, pageSize)
        }
    })

    const columns: ColumnsType<Order> = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
        },
        {
            title: 'AvgPrice',
            dataIndex: 'avgPrice',
            hidden: true,
        },
        {
            title: 'ClientOrderId',
            dataIndex: 'clientOrderId',
            hidden: true,
        },
        {
            title: 'ClosePosition',
            dataIndex: 'closePosition',
            hidden: true,
        },
        {
            title: 'OrigQty',
            dataIndex: 'origQty',
            hidden: false,
        },
        {
            title: 'CumQuote',          // Cumulative Quote Asset Transacted Quantity
            dataIndex: 'cumQuote',
            hidden: true,
        },
        {
            title: 'executedQty',
            dataIndex: 'executedQty',
        },
        {
            title: 'goodTillDate',
            dataIndex: 'goodTillDate',
            hidden: true,
        },
        {
            title: 'Side',
            dataIndex: 'side',
            render: (text: string, ) => {
                let color = 'black';
                if (text === "BUY") {
                    color = 'blue';
                } else if (text === "SELL") {
                    color = 'red';
                }
                return <span style={{ backgroundColor: "", color: color, }}>{text}</span>;
            },
        },
        {
            title: 'OrigType',
            dataIndex: 'origType',
            hidden: true,
        },
        {
            title: 'PositionSide',
            dataIndex: 'positionSide',
            hidden: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'PriceMatch',
            dataIndex: 'priceMatch',
            hidden: true,
        },
        {
            title: 'priceProtect',
            dataIndex: 'priceProtect',
            hidden: true,
        },
        {
            title: 'reduceOnly',
            dataIndex: 'reduceOnly',
            hidden: true,
        },
        {
            title: 'selfTradePreventionMode',
            dataIndex: 'selfTradePreventionMode',
            hidden: true,
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'StopPrice',
            dataIndex: 'stopPrice',
        },
        {
            title: 'time',
            dataIndex: 'time',
            hidden: true,
        },
        {
            title: 'TimeInForce',
            dataIndex: 'timeInForce',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'OrderId',
            dataIndex: 'orderId',
        },
        {
            title: 'workingType',
            dataIndex: 'workingType',
            hidden: true,
        },
        {
            title: 'UpdateTime',
            dataIndex: 'updateTime',
            // sort unix timestamp
            // sorter: (a: { updateTime: string | number | Date; }, b: { updateTime: string | number | Date; }) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
            // direction: ['ascend'],
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: string, order: Order) => {
                return (
                    <Space>
                        <Button type="primary" size="large" onClick={()=>{onClickDelete(order)}} danger>Delete</Button>
                        <Button type="primary" size="large" onClick={()=>{onClickModify(order)}} style={{ backgroundColor:"", color: ""}}>Modify</Button>
                    </Space>
                )
            }
        }
    ].filter((item) => {
        return item.hidden == undefined || item.hidden === false;   // show item are not hidden and have hidden property
    });

    const handleNewOrder = () => {
       setOpen(true);
    }

    const onTableChange = (newPaggination) => {
        setPaggination(newPaggination)
    }

    const onClick = () => {
        setLoading(true);
    }

    // get order id
    const onClickDelete = (selectedOrder: Order) => {
        setOpenDelete(true);
        setSelectedOrder(selectedOrder);
    }

    const onClickModify = (selectedOrder: Order) => {
        setOpenModify(true);
        setSelectedOrder(selectedOrder);
    }

    const onCloseNewOrder = () => {
        setOpen(false);
        setLoading(true);
    }

    const onCloseDelete = () => {
        setOpenDelete(false);
        setLoading(true);
    }

    const onCloseModify = () => {
        setOpenModify(false);
        setLoading(true);
    }

    const api_host = import.meta.env.VITE_API_HOST
    useEffect(() => {
        async function getOrders() {
            const headers = {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            };
            const resp = await axios.get<R<Order[]>>(`${api_host}/futures/order`, { headers });
            console.log(resp.data.data);
            // sort updateTime in descending order
            resp.data.data.sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime());
            setOrders(resp.data.data);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
        getOrders();
    }, [loading, orderTradeUpdate]);
    

    return (
            <div> 
                <NewOrder open={open} onCancel={onCloseNewOrder}/>

                {selectedOrder && <Delete open={openDelete} onCancel={onCloseDelete} selectedOrder={selectedOrder} />}
                {selectedOrder && <Modify open={openModify} onCancel={onCloseModify} selectedOrder={selectedOrder} /> }


                <div> 

                    <Space wrap>

                        <Button 
                        type="default"
                        size="large"
                        icon={<SearchOutlined />}
                        style={{ background: "black", color: "white" }}
                        onClick={onClick}>Orders</Button>

                        <Button type="primary" 
                            style={{ background: "rgb(109, 208, 178)", color: "white" }}
                            size="large" onClick={handleNewOrder}>New</Button>
                    </Space>

                    <StyledTable 
                        rowClassName="table-row"
                        scroll={{ x: 1000 }}
                        columns={columns} 
                        dataSource={orders} 
                        rowKey='orderId' 
                        loading={loading}
                        paggination={paggination} 
                        onChange={onTableChange}/> 
                </div>
                 
            </div>
    )
}

export default View;
    