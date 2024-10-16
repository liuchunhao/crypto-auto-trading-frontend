import {  
    Space, 
} from 'antd'

import Position from "./Position";
import Order from "./Order";
import Balance from "./Balance";
import Spot from "@/views/Wallets/Spot";

const View = () =>{                             
    console.log('Binance')

    return (
        <div className="Binance">
            <Space wrap>
                <Balance/>
                <Position/>
                <Order/>
                <Spot/>
            </Space>
        </div >
    );
}

export default View;
    
