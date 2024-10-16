// import '@/components/Comp1/comp1.scss'       
// import styles from "./spot.module.scss";        

import { InputNumber, Button, Popconfirm, Space, message, Modal, Form, Select } from "antd"; 

import axios from 'axios'

import { useEffect, useState } from 'react'

import { Wallet } from '@/views/Exness/Wallet'

interface Transfer {
    from: string;
    to: string;
    wallet: string;
    amount: number;
    invoice_id: string;
    duration: string;
}

const Comp = ({ wallet, onUpdated }: { wallet: Wallet, onUpdated: () => void }) => {

    const [open, setOpen] = useState(false);    
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();      // To get 'form' data
    const {Item} = Form;
    const initialValues = {
        wallet: wallet.wallet.includes('USDT TRC20') ? 'TRC20' : (wallet.wallet.includes('USDT ERC20') ? 'ERC20' : wallet.wallet.includes('BTC') ? 'BTC' : 'Futures'),    
        currency: wallet.currency,
        destination: wallet.wallet.includes('USDT') || wallet.wallet.includes('BTC') || wallet.wallet.includes('USDC') ? 1 : 2,
        amount: wallet.amount,
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

    const doTransfer = async () => {
        const api_host = import.meta.env.VITE_EXNESS_API_HOST
        const values = await form.validateFields();

        console.log(`onTransfer: ${values.destination}/${values.currency}/${values.amount}`)

        let network = form.getFieldValue('wallet') === 'TRC20' ? 'TRC20' : (form.getFieldValue('wallet') === 'ERC20' ? 'ERC20' : (form.getFieldValue('wallet') === 'BTC' ? 'BTC' : 'Futures'))
        network = form.getFieldValue('destination') === 2 ? 'TRC20' : form.getFieldValue('destination') === 3 ? 'ERC20' : form.getFieldValue('destination') === 4 ? 'BTC' : network 

        const payload = {
            destination: form.getFieldValue('destination') === 1 ? 'futures' : 'spot',   // 'futures' or 'spot'
            wallet: network,                            // 'TRC20' or 'ERC20'
            amount: form.getFieldValue('amount'),
        }
        const headers = {
            "ngrok-skip-browser-warning": "true",
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
        const resp = await axios.post<R<Transfer>>(`${api_host}/api/v1/exness/wallets/transfer`, payload, { headers })

        return resp
    }

    const handleTransfer = async () => {
        setLoading(true)
        const resp = (await doTransfer()).data
        resp.code === 0 ? message.success(`${resp.msg}`) : message.error(`${resp.msg}`)
        resp.code === 0 && onUpdated()

        setLoading(false);
        setOpen(false);
        console.log(`Spot|Transfer: ${resp.msg}`)
    }

    useEffect(() => {

    }, [])

    return (
        <div> 
            <Button 
                type="primary" 
                size='large' 
                onClick={onConfirm}>Transfer</Button>
            <Modal 
                title="Transfer"
                open={open}
                onCancel={onCancel} 
                onOk={()=>{}}      
                footer={[
                    <Button key="back" onClick={onCancel}>Cancel</Button>,

                    <Popconfirm
                        title="Are you sure?"
                        onConfirm={() => setTimeout(handleTransfer)}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No">
                            <Button key="submit" type="primary" loading={loading} >Transfer</Button>
                    </Popconfirm>
            ]}>

                <Form form={form} layout="vertical" labelAlign="left" initialValues={initialValues} >
                    <Space wrap>

                        <Item label="Wallet" name="wallet">
                            <Select
                                style={{ width: 150 }}
                                onChange={handleChange}
                                disabled
                                options={[
                                    { value: "Futures", label: 'Futures',   disabled: !(wallet.wallet === 'Futures') 
                                    },
                                    { value: "TRC20", label: 'Spot(TRC20)', disabled: !(wallet.wallet.includes('USDT TRC20')) 
                                    },
                                    { value: "ERC20", label: 'Spot(ERC20)', disabled: !(wallet.wallet.includes('USDT ERC20')) 
                                    }, 
                                    { value: "BTC", label: 'Spot(BTC)',   disabled: !(wallet.wallet.includes('BTC')) 
                                    },
                                    { value: "USDC", label: 'Spot(USDC)',   disabled: !(wallet.wallet.includes('USDC')) 
                                    },
                                ]} /> 

                        </Item>
                        <Item label="Currency" name="currency">
                            <Select
                                style={{ width: 120 }}
                                onChange={handleChange}
                                disabled
                                options={[
                                    { value: 'USDT', label: 'USDT', disabled: !(wallet.currency === 'USDT')},
                                    { value: 'BTC',  label: 'BTC',  disabled: !(wallet.currency === 'BTC')},
                                    { value: 'USDC', label: 'USDC', disabled: !(wallet.currency === 'USDC')},
                                ]} /> 
                        </Item>

                        <Item label="Destination" name="destination">
                            <Select
                                style={{ width: 150 }}
                                onChange={handleChange}
                                options={[
                                    { value: 1, label: 'Futures',     disabled: wallet.wallet === 'Futures'
                                    },
                                    { value: 2, label: 'Spot(TRC20)', disabled: wallet.wallet.includes('USDT') || wallet.wallet.includes('USDC') || wallet.wallet.includes('BTC')
                                    },
                                    { value: 3, label: 'Spot(ERC20)', disabled: wallet.wallet.includes('USDT') || wallet.wallet.includes('USDC') || wallet.wallet.includes('BTC')
                                    }, 
                                    { value: 4, label: 'Spot(BTC)',   disabled: true // wallet.wallet.includes('BTC') 
                                    },
                                    { value: 5, label: 'Spot(USDC)',  disabled: true // wallet.wallet.includes('USDC') 
                                    },
                                ]} /> 
                        </Item>
                        <Item label="Amount" name="amount">
                            <InputNumber
                                placeholder={ "max: " + wallet.amount}
                                style={{ width: 150 }}
                                max={wallet.amount}
                                min={0}
                                value={null}
                                />
                        </Item>
                    </Space>
                </Form>
            </Modal>

        </div>
    );
};

export default Comp;
