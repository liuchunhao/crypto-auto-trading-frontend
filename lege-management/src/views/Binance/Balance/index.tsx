/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from 'axios'
import { useEffect, 
    useState, 
} from 'react'
import { Table, Button, Space } from 'antd'
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import { SearchOutlined } from '@ant-design/icons'


interface Balance {
    accountAlias: string;               // "FzuXFzSgsRXquXoC",
    asset: string;                      // "BTC",
    availableBalance: number;           // 0.00000000,
    balance: number;
    crossUnPnl: number;
    crossWalletBalance: number;
    marginAvailable: boolean;           // true,   
    maxWithdrawAmount: number;          // 0.00000000,
    updateTime: EpochTimeStamp;         // 1629782400000,
    marginBalance: number;
}

const View = () =>{                             
    console.info('Balance')

    const [balance, setBalance] = useState<Balance[]>([])
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

    const columns: ColumnsType<Balance> = [
        {
            title: 'Account Alias', 
            dataIndex: 'accountAlias',
        },
        {
            title: 'Asset',
            dataIndex: 'asset',
        },
        {
            /** 
              
            title: 'Available Balance',
            dataIndex: 'availableBalance',
            */
        },
        {
            title: 'Margin Balance',
            dataIndex: 'marginBalance',
            align: 'right',
            render: (text: number, ) => {
                return Number(text).toFixed(2)
            },
        },
        {
            title: 'Cross UnPnl',
            dataIndex: 'crossUnPnl',
            align: 'right',
            render: (text: number, ) => {
                return Number(text).toFixed(2)
            },
        },
        {
            title: 'Cross Wallet Balance',
            dataIndex: 'crossWalletBalance',
            align: 'right',
            render: (text: number, ) => {
                return Number(text).toFixed(2)
            },
        },
        {
            /** 
            title: 'Margin Available',
            dataIndex: 'marginAvailable',
            */
        },
        {
            title: 'Max Withdraw Amount',
            dataIndex: 'maxWithdrawAmount',
            align: 'right',
            render: (text: number, ) => {
                return Number(text).toFixed(2)
            },
        },
        {
            title: 'Update Time',
            dataIndex: 'updateTime',
        },
        {
            /** 
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
            const resp = await axios.get<R<Balance[]>>(`${api_host}/balance/futures`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            })

            console.log (resp.data)
            console.log (resp.data.data['marginBalance'])

            setBalance(resp.data.data)

            setTimeout(() => {
                setLoading(false)
            }, 500)
        }

        try {
            getBalance()
        } catch (error) {
            console.error(error)
        }

    }, [loading,])

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
    
