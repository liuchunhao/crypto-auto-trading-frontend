import Balance from "@/views/Exness/Balance";
import Position from "@/views/Exness/Position";
import Order from "@/views/Exness/Order";
import Wallet from "@/views/Exness/Wallet";

const View = () =>{                             
    return (
        <div className="exness">
            
            <Balance/>
            <Position/>
            <Order/>
            <Wallet/>
            
        </div>

    )
}

export default View;
    