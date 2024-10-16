import axios from 'axios'
import { useEffect, useState, useContext } from 'react'
import { Table, Button, Space, } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import { SearchOutlined } from '@ant-design/icons'

import { UserDataContext } from '@/App'


/**
 * 
 * @returns GET http://localhost:5000/futures/trades?symbol=ETHUSDT&limit=100
 * 
 *  {
      "buyer": false,
      "commission": "0.02066011",
      "commissionAsset": "USDT",
      "id": 3377835124,
      "maker": false,
      "marginAsset": "USDT",
      "orderId": "8389765629601368386",
      "positionSide": "BOTH",
      "price": "1967.63",
      "qty": "0.021",
      "quoteQty": "41.32023",
      "realizedPnl": "0.29615579",
      "side": "SELL",
      "symbol": "ETHUSDT",
      "time": "2023-11-21 23:43:24"
    },
 */

interface Trade {
    buyer: boolean,
    commission: string,
    commissionAsset: string,
    id: number,
    maker: boolean,
    marginAsset: string,
    orderId: string,
    positionSide: string,
    price: string,
    qty: string,
    quoteQty: string,
    realizedPnl: string,
    side: string,
    symbol: string,
    time: string,
}

// Hooks: useState, useEffect, useReducer, useContext, useRef, useLayoutEffect, useImperativeHandle, useMemo, useCallback, useDebugValue

const View = () =>{                             
    console.info('Balance')

    const { accountUpdate, setAccountUpdate, orderTradeUpdate, setOrderTradeUpdate } = useContext(UserDataContext)

    const [balance, setBalance] = useState<Trade[]>([])
    const [loading, setLoading] = useState<boolean>(false)                  
    const [paggination, setPaggination] = useState<TablePaginationConfig>({     
        current: 1,
        pageSize: 10,
        total: 0,
        onChange: (page, pageSize) => {
            console.log(page, pageSize)
        }
    })
    
    function onTableChange (newPaggination: TablePaginationConfig) {
        setPaggination(newPaggination)
    }

    const columns: ColumnsType<Trade> = [
        {
            title: 'Account Alias', 
            dataIndex: 'accountAlias',
        },
        {
            title: 'Asset',
            dataIndex: 'asset',
        },
        {
            title: 'Available Balance',
            dataIndex: 'availableBalance',
        },
        {
            title: 'Cross UnPnl',
            dataIndex: 'crossUnPnl',
        },
        {
            title: 'Cross Wallet Balance',
            dataIndex: 'crossWalletBalance',
        },
        {
            title: 'Margin Available',
            dataIndex: 'marginAvailable',
        },
        {
            title: 'Max Withdraw Amount',
            dataIndex: 'maxWithdrawAmount',
        },
        {
            title: 'Update Time',
            dataIndex: 'updateTime',
        },
        {
            /** 
             * 
            title: 'Action',
            dataIndex: 'action',
            render: () => {
                return (
                    <Space>
                        <Button type="primary" danger>Del</Button>
                        <Button type="primary">Edit</Button>
                    </Space>
                )
            }
            */
        }
    ]

    const onClick = () => {
        setLoading(true)
    }

    const api_host = import.meta.env.VITE_API_HOST
    useEffect(() => {
        async function getBalance() {
            const resp = await axios.get<R<Balance[]>>(`${api_host}/futures/trades?symbol=ETHUSDT&limit=100`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })

            console.log (resp.data)

            setBalance(resp.data.data)
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }

        getBalance()

    }, [loading, orderTradeUpdate, accountUpdate])

    return (
        <div className="Futures">
            <Space wrap>
                <Button 
                    type="primary"
                    size="large"
                    icon={<SearchOutlined />}
                    style={{ background: "black", color: "white" }}

                onClick={onClick}>Balance</Button>
            </Space>

            <Table 
                columns={columns} 
                dataSource={balance} 
                rowKey='asset' 
                loading={loading}
                pagination={paggination} 
                onChange={onTableChange}></Table>
        </div>
    )
}

export default View;
    