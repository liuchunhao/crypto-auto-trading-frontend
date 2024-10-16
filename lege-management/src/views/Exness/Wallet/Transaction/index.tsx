import axios from 'axios';

import { useEffect } from 'react';
import { useState } from 'react';

import { Space, Table, Button, message } from 'antd';
import { SearchOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { ColumnsType} from 'antd/lib/table';
// import { Select } from 'antd';
// import { Form } from 'antd';
import { Dropdown, Menu } from 'antd';

import styled from 'styled-components';

// import Stop from '@/views/Binance/Position/Stop';
// import Close from '@/views/Binance/Position/Close';

// import { UserDataContext } from '@/App';
// import { get } from 'node_modules/axios/index.d.cts';

const StyledTable = styled((props) => <Table {...props} />)`
        && .ant-table-tbody > tr.ant-table-row:hover > td {
            background-color: rgb(109, 208, 178);; 
        }
    `;

export interface Result {
    account: string;
    payment_type: string;
    status: string;
    duration: string;
    transactions: Transaction[];
}

export interface Transaction {
    amount: string;
    date: string;
    invoice_id: string;
    status: string;
    type: string;
    from: string;
    to: string;
    reason: string;
}


const View = () => {                             
    console.log("Transaction");

    // const {serverTime, setServerTime, accountUpdate, setAccountUpdate, orderTradeUpdate, setOrderTradeUpdate } = useContext(UserDataContext)
    // const [stopOpen, setStopOpen] = useState<boolean>(false)

    const [transactions, setTransactions] = useState<Transaction[]>([ {} ])

    const [loading, setLoading] = useState<boolean>(false)

    const [buttonWallet, setButtonWallet] = useState<string>('All Wallets');
    const [wallet, setWallet] = useState<string>('');

    const [buttonStatus, setButtonStatus] = useState<string>('All Statuses');
    const [status, setStatus] = useState<string>('');

    const [buttonPayment, setButtonPayment] = useState<string>('All Transaction Types');
    const [payment, setPayment] = useState<string>('');

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

    const columns: ColumnsType<Transaction> = [
        {
            title: 'Invoice ID',
            dataIndex: 'invoice_id',
        },
        {
            title: 'Payment Type',
            dataIndex: 'type',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
        },
        {
            title: 'From',
            dataIndex: 'from',
        },
        {
            title: 'To',
            dataIndex: 'to',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text: string, ) => {
                let color = 'black';
                if (text === 'Done') {
                  color = 'blue';
                } else if (text === 'Processing') {
                  color = 'green';
                } else if (text === 'Rejected') {
                    color = 'red';
                }
                return <span style={{ color: color, fontStyle: "oblique bold" }}>{text}</span>;
              },
        },
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'Action',
            hidden: true,
        }
    ].filter((column) => column.hidden == undefined || column.hidden === false);

    const onClick = () => {
        setLoading(true);
        getTransaction();
    }

    function handleMenuClickStatus(e) {
        setButtonStatus(e.key);
        if (e.key === 'All Statuses') {
            setStatus('');
        } else {
            setStatus(e.key.toLowerCase());
        }
    }

    function handleMenuClickPayment(e) {
        setButtonPayment(e.key);
        if (e.key === 'All Transaction Types') {
            setPayment('');
        } else {
            setPayment(e.key.toLowerCase());
        }
    }

    function handleMenuClickWallet(e) {
        setButtonWallet(e.key);
        if (e.key === 'All Wallets') {
            setWallet('');
        } else if (e.key === 'Futures') {
            setWallet(e.key.toLowerCase());
        } else if (e.key === 'Spot(TRC20)') {
            setWallet('TRC20');
        } else if (e.key === 'Spot(ERC20)') {
            setWallet('ERC20');
        }
    }
      
    const statusMenu = (
        <Menu onClick={handleMenuClickStatus}>
          <Menu.Item key="All Statuses"  icon={<UserOutlined />}>All Statuses</Menu.Item>
          <Menu.Item key="Processing"   icon={<UserOutlined />}>Processing</Menu.Item>
          <Menu.Item key="Done"         icon={<UserOutlined />}>Done</Menu.Item>
          <Menu.Item key="Rejected"     icon={<UserOutlined />}>Rejected</Menu.Item>
        </Menu>
    );

    const paymentMenu = (
        <Menu onClick={handleMenuClickPayment}>
          <Menu.Item key="All Transaction Types"    icon={<UserOutlined />}>All Transaction Types</Menu.Item>
          <Menu.Item key="Withdrawal"               icon={<UserOutlined />}>Withdrawal</Menu.Item>
          <Menu.Item key="Deposit"     icon={<UserOutlined />}>Deposit</Menu.Item>
          <Menu.Item key="Transfer"    icon={<UserOutlined />}>Transfer</Menu.Item>
        </Menu>
    );

    const walletMenu = (
        <Menu onClick={handleMenuClickWallet}>
          <Menu.Item key="All Wallets" icon={<UserOutlined />}>All Wallets</Menu.Item>
          <Menu.Item key="Futures"    icon={<UserOutlined />}>Futures</Menu.Item>
          <Menu.Item key="Spot(TRC20)"    icon={<UserOutlined />}>Spot(TRC20)</Menu.Item>
          <Menu.Item key="Spot(ERC20)"    icon={<UserOutlined />}>Spot(ERC20)</Menu.Item>
        </Menu>
    );

    async function getTransaction() {
        const api_host = import.meta.env.VITE_EXNESS_API_HOST

        const headers = {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        };
        const url = `${api_host}/api/v1/exness/transactions`
        const resp = await axios.get<R<Result>>(url, { headers, params: {account: wallet, status: status, payment: payment} } );
        console.log(resp.data);
        setTransactions(resp.data.data.transactions);
        setLoading(false);

        if (resp.data.code === -1) {
            message.error(resp.data.msg);
        } else {
            message.success("Transactions loaded successfully in " + resp.data.data.duration + " s");
        }

    }

    useEffect(() => {

    }, [ ]);

    return (
        <div className="transaction">
            <Space wrap>
                <Button 
                type="default"
                size="large"
                loading={loading}
                icon={<SearchOutlined />}
                style={{ background: "black", color: "white" }}
                onClick={onClick}>Transactions</Button>

                <Dropdown overlay={paymentMenu} disabled={loading}>
                    <Button size='large'>
                        {buttonPayment} <DownOutlined />
                    </Button>
                </Dropdown>

                <Dropdown overlay={statusMenu} disabled={loading}>
                    <Button size='large'>
                        {buttonStatus} <DownOutlined />
                    </Button>
                </Dropdown>

                <Dropdown overlay={walletMenu} disabled={loading}>
                    <Button size='large'>
                        {buttonWallet} <DownOutlined />
                    </Button>
                </Dropdown>

            </Space>

            <StyledTable 
                rowClassName="table-row"
                columns={columns} 
                dataSource={transactions} 
                rowKey='invoice_id' 
                loading={loading}
                pagination={paggination} 
                onChange={onTableChange}/>

        </div>
    )
}

export default View;
    