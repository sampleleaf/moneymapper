import budget from "@/css/Budget.module.css";

const Budget: React.FC<{
  payPage: boolean;
  setPayPage: Function;
  setPayItem: Function;
  setIncomeItem: Function;
}> = ({ payPage, setPayPage, setPayItem, setIncomeItem }) => {

  const payItemArray = ["早餐", "午餐", "晚餐", "飲品", "點心", "交通", "購物", "娛樂", "房租", "醫療", "其他"]
  const incomeItemArray = ["薪水", "獎金", "回饋", "交易", "租金", "股息", "投資", "其他"]

  return (
    <>
      <div className={budget.header}>
        <div
          className={budget.triggerPage}
          style={
            payPage
              ? { backgroundColor: "rgb(253,201,83)" }
              : { transform: "translateX(100%)", backgroundColor: "rgb(158,225,255)" }
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
          {payItemArray.map(payItem => (
            <div key={payItem} onClick={() => setPayItem(payItem)}>
              <img src={`${payItem}.png`} alt={payItem} />
              <p>{payItem}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={budget.iconList}>
            {incomeItemArray.map(incomeItem => (
            <div key={incomeItem} onClick={() => setIncomeItem(incomeItem)}>
              <img src={`${incomeItem}.png`} alt={incomeItem} />
              <p>{incomeItem}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Budget;
