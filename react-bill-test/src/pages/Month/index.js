import { NavBar, DatePicker } from 'antd-mobile'
import './index.scss'
import {useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import _ from "lodash";
import DayBill from "./components/DayBill";

const Month = () => {
    const [dateVisible,setDateVisible] = useState(false);
    const [currentDate,setCurrentDate] = useState(()=> dayjs(new Date()).format('YYYY-MM'))
    const billList = useSelector(state=> state.bill.billList)
    const monthGroup = useMemo(() => {
       return _.groupBy(billList,item=>dayjs(item.date).format('YYYY-MM'))
    },[billList])
    const [currentMonthList,setCurrentMonthList] = useState([])
    const dayGroup = useMemo(() => {
        const groupData = _.groupBy(currentMonthList,item=>dayjs(item.date).format('YYYY-MM-DD'))
        const keys = Object.keys(groupData)
        return {
            groupData,
            keys
        }
    },[currentMonthList])
    const onConfirm = (date) =>{
        setDateVisible(false)
        const formatDate = dayjs(date).format('YYYY-MM')
        setCurrentMonthList(monthGroup[formatDate])
        setCurrentDate(formatDate)
    }
    const monthResult = useMemo(() => {
        if(currentMonthList){
            const pay = currentMonthList.filter(item=>item.type === 'pay').reduce((sum,item)=> sum + item.money,0)
            const income = currentMonthList.filter(item=>item.type === 'income').reduce((sum,item)=> sum + item.money,0)
            return{
                pay,
                income,
                total:pay + income
            }
        }else{
            return {
                pay: 0,
                income: 0,
                total: 0
            }
        }
    },[currentMonthList])



    useEffect(() => {
        const nowDate = dayjs(new Date()).format('YYYY-MM');
        if(monthGroup[nowDate]){
            setCurrentMonthList(monthGroup[nowDate])
        }
    }, [monthGroup]);
    console.log(currentMonthList)

    return (
        <div className="monthlyBill">
            <NavBar className="nav" backArrow={false}>
                月度收支
            </NavBar>
            <div className="content">
                <div className="header">
                    {/* 时间切换区域 */}
                    <div className="date" onClick={() => setDateVisible(true)}>
                        <span className="text">
                            {currentDate+''}月账单
                        </span>
                        <span className= {classNames('arrow',dateVisible && 'expand')}></span>
                    </div>
                    {/* 统计区域 */}
                    <div className='twoLineOverview'>
                        <div className="item">
                            <span className="money">{monthResult.pay.toFixed(2)}</span>
                            <span className="type">支出</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.income.toFixed(2)}</span>
                            <span className="type">收入</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.total.toFixed(2)}</span>
                            <span className="type">结余</span>
                        </div>
                    </div>
                    {/* 时间选择器 */}
                    <DatePicker
                        className="kaDate"
                        title="记账日期"
                        precision="month"
                        visible={dateVisible}
                        max={new Date()}
                        onCancel={() => setDateVisible(false)}
                        onConfirm={val=> onConfirm(val)}
                        closeOnMaskClick
                    />
                </div>
                {/*{单日列表统计}*/}
                {currentMonthList && currentMonthList.length > 0 &&
                    dayGroup.keys.map(key=>{
                        return <DayBill key={key} date={key} billList={dayGroup.groupData[key]}/>
                    })
                }
            </div>
        </div >
    )
}

export default Month