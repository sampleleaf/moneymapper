import budget from "@/css/Budget.module.css";

const Budget: React.FC<{
  payPage: boolean;
  setPayPage: Function;
  setPayItem: Function;
  setIncomeItem: Function;
}> = ({ payPage, setPayPage, setPayItem, setIncomeItem }) => {
  return (
    <>
      <div className={budget.header}>
        <div
          className={budget.triggerPage}
          style={
            payPage
              ? { backgroundColor: "yellow" }
              : { transform: "translateX(100%)", backgroundColor: "aqua" }
          }
        ></div>
        <div className={budget.choose}>
          <div onClick={() => setPayPage(true)}>支出</div>
          <span className={budget.vertical}></span>
          <div onClick={() => setPayPage(false)}>收入</div>
        </div>
      </div>
      {payPage ? (
        <div className={budget.iconList}>
          <div onClick={() => setPayItem("早餐")}>
            {/* <i className="fa-solid fa-bread-slice"></i> */}
            <p>早餐</p>
          </div>
          <div onClick={() => setPayItem("午餐")}>
            {/* <i className="fa-solid fa-bowl-rice"></i> */}
            <p>午餐</p>
          </div>
          <div onClick={() => setPayItem("晚餐")}>
            {/* <i className="fa-solid fa-utensils"></i> */}
            <p>晚餐</p>
          </div>
          <div onClick={() => setPayItem("飲品")}>
            {/* <i className="fa-solid fa-mug-hot"></i> */}
            <p>飲品</p>
          </div>
          <div onClick={() => setPayItem("點心")}>
            {/* <i className="fa-solid fa-ice-cream"></i> */}
            <p>點心</p>
          </div>
          <div onClick={() => setPayItem("交通")}>
            {/* <i className="fa-solid fa-bus"></i> */}
            <p>交通</p>
          </div>
          <div onClick={() => setPayItem("購物")}>
            {/* <i className="fa-solid fa-bag-shopping"></i> */}
            <p>購物</p>
          </div>
          <div onClick={() => setPayItem("娛樂")}>
            {/* <i className="fa-solid fa-gamepad"></i> */}
            <p>娛樂</p>
          </div>
          <div onClick={() => setPayItem("房租")}>
            {/* <i className="fa-solid fa-house-chimney-window"></i> */}
            <p>房租</p>
          </div>
          <div onClick={() => setPayItem("醫療")}>
            {/* <i className="fa-solid fa-hospital"></i> */}
            <p>醫療</p>
          </div>
          <div onClick={() => setPayItem("其他")}>
            {/* <i className="fa-brands fa-buromobelexperte"></i> */}
            <p>其他</p>
          </div>
        </div>
      ) : (
        <div className={budget.iconList}>
          <div onClick={() => setIncomeItem("薪水")}>
            <p>薪水</p>
          </div>
          <div onClick={() => setIncomeItem("獎金")}>
            <p>獎金</p>
          </div>
          <div onClick={() => setIncomeItem("回饋")}>
            <p>回饋</p>
          </div>
          <div onClick={() => setIncomeItem("交易")}>
            <p>交易</p>
          </div>
          <div onClick={() => setIncomeItem("租金")}>
            <p>租金</p>
          </div>
          <div onClick={() => setIncomeItem("股息")}>
            <p>股息</p>
          </div>
          <div onClick={() => setIncomeItem("投資")}>
            <p>投資</p>
          </div>
          <div onClick={() => setIncomeItem("其他")}>
            <p>其他</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Budget;
