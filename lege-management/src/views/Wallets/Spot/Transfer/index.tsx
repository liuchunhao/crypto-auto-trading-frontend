// import '@/components/Comp1/comp1.scss'       
import styles from "./spot.module.scss";        

import { InputNumber, Button, Popconfirm, Space, message, Modal, Form, Select } from "antd"; 

import axios from 'axios'
import { useEffect, useState } from 'react'

interface Transfer {
    tranId: number;
}

const Comp = ({ onUpdated }: { onUpdated: () => void }) => {
    const [open, setOpen] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();      // To get 'form' data
    const {Item} = Form;
    const initialValues = {
        destination: 1,
        coin: 'USDT',
        amount: 0.0,
    };

    const onConfirm = async () => {
        setOpen(true);
    }

    const onCancel = () => {
        setOpen(false);
    }

    const handleChange = (value: string) => {
        console.log(`Spot|Transfer|selected: ${value}`);
    }

    const api_host = import.meta.env.VITE_API_HOST

    const doTransfer = async () => {
        const values = await form.validateFields();
        console.log(`onTransfer: ${values.destination}/${values.coin}/${values.amount}`)
        const payload = {
            type: form.getFieldValue('destination'),
            asset: form.getFieldValue('coin'),
            amount: form.getFieldValue('amount'),
        }
        const headers = {
            "ngrok-skip-browser-warning": "true",
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        const resp = await axios.post<R<Transfer>>(`${api_host}/wallets/transfer`, payload, { headers })
        return resp
    }

    const handleTransfer = async () => {
        setLoading(true)
        const resp = (await doTransfer()).data
        resp.code === 0 ? message.success(`${resp.msg}: tranId:[${resp.data.tranId}]`) : message.error(`${resp.msg}`)
        resp.data && console.log(`tranId: ${resp.data.tranId}`)

        resp.code === 0 && onUpdated()

        setTimeout(() => {
            setLoading(false);
        }, 1000)
        console.log(`Spot|Transfer: Done`)
    }

    return (
        <div> 
            <Button 
                type="primary" 
                size='large' 
                onClick={onConfirm}>Transfer</Button>
            <Modal 
                title="Transfer"
                open={open}
                onCancel={()=>{ }} 
                onOk={()=>{ }}      
                footer={[
                    <Button key="back" onClick={onCancel}>Cancel</Button>,

                    <Popconfirm
                        title="Are you sure?"
                        onConfirm={handleTransfer}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No">
                            <Button key="submit" type="primary" loading={loading} >Transfer</Button>
                    </Popconfirm>
            ]}>

                <Form form={form} layout="vertical" labelAlign="left" initialValues={initialValues} >
                    <Space wrap>
                        <Item label="Destination" name="destination">
                            <Select
                                style={{ width: 150 }}
                                onChange={handleChange}
                                options={[
                                    { value: 1, label: 'Spot -> Futures' },
                                    { value: 2, label: 'Futures -> Spot' },
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
                                // placeholder="please enter amount" 
                                style={{ width: 150 }}/>
                        </Item>
                    </Space>
                </Form>
            </Modal>

        </div>
    );
};

export default Comp;
