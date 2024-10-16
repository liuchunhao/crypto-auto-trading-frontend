// import '@/components/Comp1/comp1.scss'      // 全局引入樣式 影響到所有的組件

import styles from "./futures.module.scss"; // 局部引入樣式 只影響到當前組件

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

    const spot: Spot[] = [
        { asset: 'BTC', amount: 0.0 },
        { asset: 'ETH', amount: 0.0 },
        { asset: 'USDT', amount: 0.0 },
    ];

    return (
        <div className={styles.box}>
            <p>Wallet / Futures is here</p>
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
