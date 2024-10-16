import axios from 'axios';

import { useContext, useEffect, useState } from 'react';

import { Popconfirm, Space, Table, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnsType} from 'antd/lib/table';

import styled from 'styled-components';

import Stop from '@/views/Binance/Position/Stop';
import Close from '@/views/Binance/Position/Close';
import { UserDataContext } from '@/App';

const StyledTable = styled((props) => <Table {...props} />)`
        && .ant-table-tbody > tr.ant-table-row:hover > td {
            background-color: rgb(109, 208, 178);; 
        }
    `;

export interface Position {
    adlQuantile: number;            // 1
    breakEvenPrice: number;
    entryPrice: number;             // "19188.75"
    isAutoAddMargin: boolean;       // "false"
    isolated: boolean;              // false;
    isolatedMargin: number;         // "0.00000000",
    isolatedWallet: number;         // "0",
    leverage: number;               // "20",
    liquidationPrice: number;       // "41080.17734766",
    marginType: string;             // "cross",
    markPrice: number;              // "36586.77203922",
    maxNotionalValue: number;       // "20000000",
    notional: number;               // "-128053.70213727",
    positionAmt: number;            // "-3.500",
    positionSide: string;           // "BOTH",
    symbol: string;                 // "BTCUSDT",
    unRealizedProfit: number;       // "-60893.07713727",
    updateTime: string;             // 1698243602632
}

const View = () => {                             
    console.log("Position");

    const { serverTime, setServerTime, accountUpdate, setAccountUpdate, orderTradeUpdate, setOrderTradeUpdate } = useContext(UserDataContext)
    const [stopOpen, setStopOpen] = useState<boolean>(false)
    const [positions, setPositions] = useState<Position[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [paggination, setPaggination] = useState({
        current: 1,
        pageSize: 10,
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
            title: 'symbol',
            dataIndex: 'symbol',
        },
        {
            title: 'positionSide',
            dataIndex: 'positionSide',
            hidden: true,
        },
        {
            title: 'Side',
            dataIndex: 'Side',
            render: (_: string, position: Position) => {
                let color = 'black';
                if (position.positionAmt >= 0) {
                    color = 'blue';
                } else if (position.positionAmt < 0) {
                    color = 'red';
                }
                return <span style={{ color: color, fontStyle: "oblique bold" }} >{position.positionAmt > 0? "BUY":"SELL"}</span>
            },
        },
        {
            title: 'Volume',
            dataIndex: 'positionAmt',
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
            title: 'EntryPrice',
            dataIndex: 'entryPrice',
            align: 'right',
            render: (text: number, ) => {
                return Number(text).toFixed(2)
            },
        },
        {
            title: 'MarketPrice',
            dataIndex: 'markPrice',
            align: 'right',
            render: (text: number, ) => {
                return Number(text).toFixed(2)
            },
        },
        {
            title: 'unRealizedProfit',
            dataIndex: 'unRealizedProfit',
            align: 'right',
            render: (text: number, ) => {
                const v =  Number(text);
                let color = 'black';
                if (v >= 0) {
                    color = 'blue';
                } else if (v < 0) {
                    color = 'red';
                }
                return <span style={{ color: color, fontStyle: "oblique bold" }}>{v.toFixed(2)}</span>;
            },
        },
        {
            title: 'adlQuantile',
            dataIndex: 'adlQuantile',
            hidden: true,
        },
        {
            title: 'updateTime',
            dataIndex: 'updateTime',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: string, position: Position) => {
                return (
                    <Space>
                        {/* <Button type="primary" size= "large" danger>Close</Button> */}
                        <Close selected={position}/>
                        <Stop selected={position}/>
                    </Space>
                )
            }
        }
    ].filter((column) => column.hidden == undefined || column.hidden === false);

    const onClick = () => {
        setLoading(true);
    }

    const api_host = import.meta.env.VITE_API_HOST
    useEffect(() => {
        async function getPositions() {
            const headers = {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            };
            const resp = await axios.get<R<Position[]>>(`${api_host}/futures/position`, { headers });
            console.log(resp.data.data);
            setPositions(resp.data.data);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }

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
                    <Button type="primary" size="large" danger>Close All</Button>
                </Popconfirm>
            </Space>

            <StyledTable 
                rowClassName="table-row"
                columns={columns} 
                dataSource={positions} 
                rowKey='symbol' 
                loading={loading}
                pagination={paggination} 
                onChange={onTableChange}/>

        </div>
    )
}

export default View;
    