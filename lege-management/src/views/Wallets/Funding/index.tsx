// import '@/components/Comp1/comp1.scss'      // 全局引入樣式 影響到所有的組件

import styles from "./funding.module.scss"; // 局部引入樣式 只影響到當前組件

import { Table } from "antd"; // 引入 antd 的 Table 組件
import { ColumnsType } from "antd/es/table";

interface Spot {
    asset: string;
    amount: number;
}

const columns: ColumnsType<Spot> = [
    {
        title: 'Asset',
        dataIndex: 'asset',
        key: 'asset',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
    }
];

const Comp = () => {
// a componet to check spot wallet balance and do "deposit", "transfer" and "withdraw" operations

    const spot: Spot[] = [
        { asset: 'BTC', amount: 1.2345 },
        { asset: 'ETH', amount: 10.1234 },
        { asset: 'USDT', amount: 1000.0 },
    ];

    return (
        <div className={styles.box}>
            <p>Wallet / Funding is here</p>
            <Table 
            columns={columns} 
            dataSource={spot} 
            rowKey='asset' 
            loading={false}
            pagination={false} 
            onChange={() => {}}></Table>
        </div>
    );


};
export default Comp;
