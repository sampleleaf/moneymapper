import details from '@/css/Details.module.css'
import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'

const Details = () => {
    const [x, setX] = useState('')

    return(
        <>  
            <div className={details.space}></div>
            <Link to=".." className={details.back}><i className="fa-solid fa-chevron-left"></i></Link>
            <div className={details.navbarLayout}>
                <div className={details.navbarContainer}>
                    <Link onClick={() => setX('translateX(10%)')} to="pay">支出</Link>
                    <Link onClick={() => setX('translateX(30%)')} to="income">收入</Link>
                    <Link onClick={() => setX('translateX(50%)')} to="remainder">結餘</Link>
                </div>
            </div>
            <div className={details.test} style={{transform : x}}>haha</div>
            <Outlet />
        </>
    )
}

export default Details