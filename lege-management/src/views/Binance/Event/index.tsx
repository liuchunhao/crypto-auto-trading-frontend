/* eslint-disable @typescript-eslint/no-unused-vars */

// @ts-check

import React, { useContext } from 'react';
import { Space, Input, Form } from 'antd';
import { UserDataContext } from '../../../App'

const { TextArea } = Input 

const { Item } = Form

const View = () =>{

    const { serverTime, 
            // setServerTime, 
            accountUpdate, 
            // setAccountUpdate, 
            orderTradeUpdate, 
            // setOrderTradeUpdate 
        } = useContext<UserDataContext>(UserDataContext);

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(e.target.value)
    }

    return (
        <div>
            <Form layout="vertical" labelAlign="left" >
                <Item label="Last Update" name="heartbeat" >
                    <Space wrap>
                        <TextArea value={serverTime} style={{ width: 280, height: 80 }} />
                        <TextArea value={`${accountUpdate}`} style={{ width: 280, height: 80 }}    onChange={onChange} />
                        <TextArea value={orderTradeUpdate} style={{ width: 280, height: 80 }}      onChange={onChange} /> 
                    </Space>
                </Item>
            </Form>
      </div>
    )
}

export default View;