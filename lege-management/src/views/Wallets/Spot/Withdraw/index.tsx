// import '@/components/Comp1/comp1.scss'       // 全局引入樣式 影響到所有的組件
import styles from "./spot.module.scss";        // 局部引入樣式 只影響到當前組件

import { Input, InputNumber, Button, Popconfirm, Space, message, Modal, Form, Select } from "antd"; // 引入 antd 的 Table 組件

import axios from 'axios'
import { useEffect, useState } from 'react'

interface Withdraw {
    id: string     // "46b77fa9e8214b28893196810109493b"
}

const Comp = ({ onUpdated }: { onUpdated: () => void }) => {
    console.info("Withdraw");

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();      
    const {Item} = Form;

    const addressWhiteList = {
        "TRX": "TJVgcdikVX9uavZmhPuTGBahyPxJ5bcYop",
        "ETH": "0x9d0b7b1d98a20001387f0de8e8ddc91b0126822a"
    }

    const initialValues = {
        network: "TRX",
        walletType: 0,  
        coin: "USDT",
        address: "TJVgcdikVX9uavZmhPuTGBahyPxJ5bcYop",
        amount: 1.0
    };

    const onClick = (open: boolean) => {
        setOpen(open);
    }

    const onCancel = () => {
        setOpen(false);
    }

    const handleChange = (value: string) => {
        console.info(`selected ${value}`);
    }

    const onNetworkChange = () => {
        const network = form.getFieldValue('network')
        const address = addressWhiteList[network] 
        form.setFieldsValue({ address: address })
    }

    const onAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const whitelisted = e.target.value === addressWhiteList[form.getFieldValue('network')]
        if(whitelisted) 
            console.info(`your address : [${e.target.value}] is whitelisted` )
        else 
            message.error(`your address : [${e.target.value}] are NOT whitelisted` )
    }

    const api_host = import.meta.env.VITE_API_HOST

    const handleWithdraw = async () => {
        setLoading(true);
        const networkLabel = form.getFieldValue('network') === 'TRX' ? 'TRC20' : 'ERC20'
        const walletTypeLabel = form.getFieldValue('walletType') === 0 ? 'Spot' : 'Futures'

        console.info(`handleWithdraw: ${networkLabel} / ${walletTypeLabel} / ${form.getFieldValue('coin')} / ${form.getFieldValue('address')} / ${form.getFieldValue('amount')}`)

        const walletType = form.getFieldValue('walletType')
        const network = form.getFieldValue('network')
        // const coin = form.getFieldValue('coin')
        const address = form.getFieldValue('address')
        const amount = form.getFieldValue('amount')

        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "ngrok-skip-browser-warning": "true"
        }

        const payload = {
            walletType: walletType,    // 0: spot, 1: futures
            network: network,
            address: address,
            amount: amount
        }
        const resp = await axios.post<R<Withdraw>>(`${api_host}/wallets/withdraw`, payload, { headers })
        resp.data.code === 0 ? message.success(`Withdraw id: ${resp.data.data.id}`) : message.error(`${resp.data.msg}}`);
        resp.data.code === 0 && onUpdated()

        setTimeout(() => {
            setLoading(false);
        }, 500)
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
                open={open}
                onCancel={()=>{ }} 
                onOk={()=>{ }}      
                footer={[
                    <Button key="back" size="large" onClick={onCancel}>Cancel</Button>,

                    <Popconfirm
                        title="Are you sure?"
                        onConfirm={handleWithdraw}
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
                                    { value: 'TRX', label: 'TRC20' },
                                    { value: 'ETH', label: 'ERC20' },
                                ]} /> 
                        </Item>
                        <Item label="WalletType" name="walletType">
                            <Select
                                style={{ width: 120 }}
                                onChange={handleChange}
                                options={[
                                    { value: 0,  label: 'Spot' },
                                    { value: 1,  label: 'Futures', disabled: true },
                                ]} /> 
                        </Item>

                        <Item label="Coin" name="coin">
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
                                placeholder="please enter amount > 10" 
                                style={{ width: 150 }}/>
                        </Item>
                        <Item label="Address" name="address">
                            <Input.TextArea style={{ width: 450 }} onChange={onAddressChange}/>
                        </Item>
                </Form>
                </Space>
            </Modal>

        </div>
    );
};

export default Comp;
