import header from '@/css/Header.module.css'

const Header: React.FC = () => {
    return (
        <div className={header.container}>
            <div className={header.bar}><i className="fa-solid fa-bars"></i></div>
            <div className={header.title}>MoneyMapper</div>
            <div className={header.iconContainer}>
                <i className="fa-solid fa-map-location-dot"></i>
                <i className="fa-solid fa-circle-user"></i>
            </div>
        </div>
    )
}

export default Header