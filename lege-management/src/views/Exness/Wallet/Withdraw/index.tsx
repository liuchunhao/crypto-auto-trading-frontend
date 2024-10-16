// import '@/components/Comp1/comp1.scss'           // 全局引入樣式 影響到所有的組件
// import styles from "./spot.module.scss";         // 局部引入樣式 只影響到當前組件

import { Input, InputNumber, Button, Popconfirm, Space, message, Modal, Form, Select } from "antd"; // 引入 antd 的 Table 組件

import axios from 'axios'
import { useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { Table } from 'antd'

import { Wallet } from "../";

interface Withdrawal {
    network: string,        // "TRC20"
    address: string,        // "46b77fa9e8214b28893196810109493b"
    amount: number,         // 100
    msg?: string
}

const Comp = ( {wallet, onUpdate}: { wallet: Wallet, onUpdate: ()=> void }) => {
    console.info(`Withdraw|wallet: ${wallet.wallet} / ${wallet.amount}`);

    const [withdrawal, setWithdrawal] = useState<Withdrawal[]>([])

    const [paggination, setPaggination] = useState({
        current: 1,
        pageSize: 1,
        total: 0,
        onChange: (page, pageSize) => {
            console.log(page, pageSize)
        }
    })
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();      
    const {Item} = Form;
    const columns: ColumnsType<Withdrawal> = [
        {
            title: 'Network', 
            dataIndex: 'network',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            hidden: true
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
        },
        {
            title: 'Message',
            dataIndex: 'msg',
        },
    ]

    const binanceAddress = {
        "TRC20": import.meta.env.VITE_BINANCE_WITHDRAWAL_ADDRESS_TRC20,
        "ERC20": import.meta.env.VITE_BINANCE_WITHDRAWAL_ADDRESS_ERC20,
    }

    const network = wallet.wallet.includes('USDT TRC20') ? 'TRC20' : (wallet.wallet.includes('USDT ERC20') ? 'ERC20' : 'BTC')

    const initialValues = {
        network: network,           // TRC20, ERC20
        address: binanceAddress[network],
        currency: "USDT",
        amount: wallet.amount,
    }

    const onClick = (open: boolean) => {
        setOpen(open);
    }

    const onCancel = () => {
        setOpen(false);
        setWithdrawal([])
    }

    const onTableChange = (newPaggination) => {
        setPaggination(newPaggination)
    }

    const handleChange = (value: string) => {
        console.info(`selected ${value}`);
    }

    const onNetworkChange = () => {
        const network = form.getFieldValue('network')
        const address = binanceAddress[network] 
        form.setFieldsValue({ address: address })
    }

    const onAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const whitelisted = e.target.value === binanceAddress[form.getFieldValue('network')]
        if(whitelisted) 
            console.info(`your address : [${e.target.value}] is whitelisted` )
        else 
            message.error(`your address : [${e.target.value}] are NOT whitelisted` )
    }


    const handleWithdraw = async () => {
        setLoading(true);

        const api_host = import.meta.env.VITE_EXNESS_API_HOST

        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "ngrok-skip-browser-warning": "true"
        }

        const payload = {
            network: form.getFieldValue('network'),
            amount: form.getFieldValue('amount'),
            currency: form.getFieldValue('currency'),
        }

        const url = `${api_host}/api/v1/exness/withdraw`
        const resp = await axios.post<R<Withdrawal>>(url, payload, {headers}) 
        resp.data.code === 0 ? message.success(`Withdraw: ${resp.data.msg}`) : message.error(`${resp.data.msg}}`);


        resp.data.data.msg = resp.data.msg 

        setWithdrawal([resp.data.data])
        setLoading(false);
        
        resp.data.code === 0 && onUpdate()
    }

    return (
        <div>
            <Button 
                danger 
                type="primary" 
                size='large' 
                onClick={() => { onClick(true) }} >Withdraw</Button>
            <Modal 
                title="Withdraw"
                style={{ width: 1000 }}
                open={open}
                onCancel={()=>{setOpen(false)}} 
                onOk={()=>{  }}      
                footer={[
                    <Button key="back" size="large" onClick={onCancel}>Cancel</Button>,

                    <Popconfirm
                        title="Are you sure?"
                        onConfirm={ () => setTimeout(handleWithdraw) }
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No">
                            <Button key="submit" size="large" type="primary" loading={loading} >Withdraw</Button>
                    </Popconfirm>
                ]}>

                <Space wrap>
                    <Form form={form} layout="vertical" labelAlign="left" initialValues={initialValues} >
                        <Item label="Network" name="network">
                            <Select
                                style={{ width: 150 }}
                                onChange={onNetworkChange}
                                options={[
                                    { value: 'TRC20', label: 'TRC20' },
                                    { value: 'ERC20', label: 'ERC20' },
                                ]} /> 
                        </Item>
                        <Item label="External Address" name="address">
                            <Input.TextArea 
                                disabled 
                                style={{ width: 450 }} 
                                onChange={onAddressChange}/>
                        </Item>
                        <Item label="Currency" name="currency">
                            <Select
                                style={{ width: 120 }}
                                onChange={handleChange}
                                options={[
                                    { value: 'USDT', label: 'USDT' },
                                    { value: 'BTC',  label: 'BTC', disabled: true },
                                ]} /> 
                        </Item>
                        <Item label="Amount" name="amount">
                            <InputNumber
                                placeholder={`min: 10 - max: ${wallet.amount}`}
                                // min={10}  
                                max={wallet.amount}
                                style={{ width: 200 }}/>
                        </Item>
                        <Table 
                            columns={columns} 
                            dataSource={withdrawal} 
                            rowKey='network'
                            loading={loading}
                            pagination={false}
                            // pagination={paggination} 
                            onChange={onTableChange}></Table>
                    </Form>
                </Space>
            </Modal>
        </div>
    );
};

export default Comp;
