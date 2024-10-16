// import '@/components/Comp1/comp1.scss'      // 全局引入樣式 影響到所有的組件
import styles from './comp1.module.scss'       // 局部引入樣式 只影響到當前組件

// function Comp () {
const Comp = () =>{                             // 箭頭函數
    return (
        <div className={styles.box}>
            <p>Comp1 is here</p>
        </div>
    )
}

export default Comp;
