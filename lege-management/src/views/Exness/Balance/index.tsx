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
    balance: number;
    equity: number;
    login: number;
    profit: number;
    timestamp: string;
}

const View = () =>{                             
    console.info('Exness/Balance')

    const [balance, setBalance] = useState<Balance[]>([ { login: 0, balance: 0, equity: 0, profit: 0 } ])
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
            title: 'Account', 
            dataIndex: 'login',
            render: (text: number) => {
                return <a>{text}</a>
            }
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
        },
        {
            title: 'Equity',
            dataIndex: 'equity',
        },
        {
            title: 'profit',
            dataIndex: 'profit',
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
        }
    ]

    const onClick = () => {
        setLoading(true)
    }

    const api_host = import.meta.env.VITE_EXNESS_API_HOST
    useEffect(() => {
        
        async function getBalance() {
            const resp = await axios.get<R<Balance>>(`${api_host}/api/v1/exness/balance`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            })

            console.log (resp.data)
            console.log (resp.data.code)
            console.log (resp.data.timestamp)
            console.log (resp.data.msg)

            resp.data.data.timestamp = resp.data.timestamp

            setBalance([resp.data.data])

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
        <Space wrap>
            <div>
                <Button 
                    type="primary"
                    size="large"
                    icon={<SearchOutlined />}
                    style={{ background: "black", color: "white" }}
                    onClick={onClick}>Balance</Button>

                    <Table 
                        columns={columns} 
                        dataSource={balance} 
                        rowKey='login' 
                        loading={loading}
                        pagination={paggination} 
                        onChange={onTableChange}></Table>
            </div>
        </Space>
    )
}

export default View;
    
