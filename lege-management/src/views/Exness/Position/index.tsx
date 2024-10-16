import axios from 'axios';

import { useContext, useEffect, useState } from 'react';

import { Popconfirm, Space, Table, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnsType} from 'antd/lib/table';

import styled from 'styled-components';

import { UserDataContext } from '@/App';

import Stop from './Stop';
import Close from './Close';

const StyledTable = styled((props) => <Table {...props} />)`
        && .ant-table-tbody > tr.ant-table-row:hover > td {
            background-color: rgb(109, 208, 178);; 
        }
    `;

export interface Result {
    count: number;
    positions: Position[];
}

export interface Position {
    comment: string;
    external_id: string;
    identifier: number;
    magic: number;
    price_current: number;
    price_open: number;
    profit: number;
    reason: number;
    swap: number;
    symbol: string;
    ticket: number;
    time: number;
    time_msc: string;
    time_update: number;
    time_update_msc: string;    
    sl: number;
    tp: number;
    type: string;
    volume: number;
}

const View = () => {                             
    console.log("Exness/Positions");

    const { serverTime, setServerTime, accountUpdate, setAccountUpdate, orderTradeUpdate, setOrderTradeUpdate } = useContext(UserDataContext)
    // const [stopOpen, setStopOpen] = useState<boolean>(false)

    const [positions, setPositions] = useState<Position[]>([{ comment: "", external_id: "", identifier: 0, magic: 0, price_current: 0, price_open: 0, profit: 0, reason: 0, sl: 0, swap: 0, symbol: "", ticket: 0, time: 0, time_msc: "", time_update: 0, time_update_msc: "", tp: 0, type: "", volume: 0}])
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

    const columns: ColumnsType<Position> = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
        },
        {
            title: 'Ticket',
            dataIndex: 'ticket',
        },
        {
            title: 'Side',
            dataIndex: 'type',
            render: (_: string, position: Position) => {
                let color = 'black';
                if (position.type == 'buy') {
                    color = 'red';
                } else if (position.type == 'sell') {
                    color = 'blue';
                }
                return <span style={{ color: color, fontStyle: "oblique bold" }}>{position.type == 'buy'? "BUY":"SELL"}</span>
            },
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            align: 'right',
            render: (text: number, ) => {
                let color = 'black';
                if (text >= 0) {
                  color = 'blue';
                } else if (text < 0) {
                  color = 'red';
                }
                return <span style={{ color: color, fontStyle: "oblique bold" }}>{text}</span>;
              },
        },
        {
            title: 'Entry Price',
            dataIndex: 'price_open',
            align: 'right', 
            render: (value: number, ) => {
                // Round all numbers to two decimal points and add zero if they are integers
                // add comma to separate every 3 digits
                return  value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
        },
        {
            title: 'Market Price',
            dataIndex: 'price_current',
            align: 'right',
            render: (value: number, ) => {
                // Round all numbers to two decimal points and add zero if they are integers
                // add comma to separate every 3 digits
                return  value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
        },
        {
            title: 'Unrealized Profit',
            dataIndex: 'profit',
            align: 'right',
            render: (value: number, ) => {
                // Round all numbers to two decimal points and add zero if they are integers
                // add comma to separate every 3 digits
                return  value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
        },
        {
            title: 'Update Time',
            dataIndex: 'time_update_msc',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: string, position: Position) => {
                return (
                    <Space>
                        <Close position={position} onUpdate={getPositions}/>
                        <Stop position={position} onUpdate={getPositions}/>
                    </Space>
                )
            },
            hidden: false,
        }
    ].filter((column) => column.hidden == undefined || column.hidden === false);

    const onClick = () => {
        setLoading(true);
    }

    async function getPositions() {
        const api_host = import.meta.env.VITE_EXNESS_API_HOST

        const headers = {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };

        const resp = await axios.get<R<Result>>(`${api_host}/api/v1/exness/positions`, { headers });

        console.log(resp.data.data);

        // resp.data.code === 0 ? message.success("Positions retrieved") : message.error("Positions retrieval failed");

        resp.data.data.positions.sort((a, b) => new Date(b.time_update_msc).getTime() - new Date(a.time_update_msc).getTime());

        setPositions(resp.data.data.positions);
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }

    useEffect(() => {
        getPositions();

    }, [loading, orderTradeUpdate]);

    return (
        <div className="position">

            <Space>
                <Button 
                type="default"
                size="large"
                icon={<SearchOutlined />}
                style={{ background: "black", color: "white" }}
                onClick={onClick}>Position</Button>
            
                <Popconfirm title="Sure to close all?" okText="Yes" cancelText="No">
                    <Button type="primary" 
                        size="large" 
                        danger 
                        disabled
                        onClick={()=>{message.info("To Be Implemented")}}>Close All</Button>
                </Popconfirm>
            </Space>

            <StyledTable 
                rowClassName="table-row"
                columns={columns} 
                dataSource={positions} 
                rowKey='ticket' 
                loading={loading}
                pagination={paggination} 
                onChange={onTableChange}/>

        </div>
    )
}

export default View;
    