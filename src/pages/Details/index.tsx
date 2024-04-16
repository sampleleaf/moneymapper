import details from '@/css/Details.module.css'
import { Link, Outlet } from 'react-router-dom'

const Details: React.FC<{ detailsTranslateX: string, setDetailsTranslateX: Function }> = ({ detailsTranslateX, setDetailsTranslateX }) => {

    return(
        <>  
            <div className={details.space}></div>
            <Link to=".." className={details.back}><i className="fa-solid fa-chevron-left"></i></Link>
            <div className={details.navbarLayout}>
                <div className={details.triggerLink} style={{transform : detailsTranslateX}}></div>
                <div className={details.navbarContainer}>
                    <Link onClick={() => setDetailsTranslateX('translateX(-102.5%)')} to="pay">支出</Link>
                    <Link onClick={() => setDetailsTranslateX('translateX(0)')} to="income">收入</Link>
                    <Link onClick={() => setDetailsTranslateX('translateX(102.5%)')} to="remainder">結餘</Link>
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default Details