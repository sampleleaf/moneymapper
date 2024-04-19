import budget from "@/css/Budget.module.css";

const Budget: React.FC<{
  payPage: boolean;
  setPayPage: Function;
  setPayItem: Function;
  setPaySrc: Function;
  setIncomeItem: Function;
  setIncomeSrc: Function;
}> = ({ payPage, setPayPage, setPayItem, setPaySrc, setIncomeItem, setIncomeSrc }) => {

  const handlePayItem = (item: string, src: string) => {
    setPayItem(item)
    setPaySrc(src)
  }

  const handleIncomeItem = (item: string, src: string) => {
    setIncomeItem(item)
    setIncomeSrc(src)
  }
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
          <div onClick={() => handlePayItem("早餐", "breakfast.png")}>
            <img src="breakfast.png" alt="breakfast.png" />
            <p>早餐</p>
          </div>
          <div onClick={() => handlePayItem("午餐", "lunch.png")}>
            <img src="lunch.png" alt="lunch.png" />
            <p>午餐</p>
          </div>
          <div onClick={() => handlePayItem("晚餐", "dinner.png")}>
            <img src="dinner.png" alt="dinner.png" />
            <p>晚餐</p>
          </div>
          <div onClick={() => handlePayItem("飲品", "drink.png")}>
            <img src="drink.png" alt="drink.png" />
            <p>飲品</p>
          </div>
          <div onClick={() => handlePayItem("點心", "dessert.png")}>
            <img src="dessert.png" alt="dessert.png" />
            <p>點心</p>
          </div>
          <div onClick={() => handlePayItem("交通", "transport.png")}>
            <img src="transport.png" alt="transport.png" />
            <p>交通</p>
          </div>
          <div onClick={() => handlePayItem("購物", "shopping.png")}>
            <img src="shopping.png" alt="shopping.png" />
            <p>購物</p>
          </div>
          <div onClick={() => handlePayItem("娛樂", "game.png")}>
            <img src="game.png" alt="game.png" />
            <p>娛樂</p>
          </div>
          <div onClick={() => handlePayItem("房租", "payrent.png")}>
            <img src="payrent.png" alt="payrent.png" />
            <p>房租</p>
          </div>
          <div onClick={() => handlePayItem("醫療", "medical.png")}>
            <img src="medical.png" alt="medical.png" />
            <p>醫療</p>
          </div>
          <div onClick={() => handlePayItem("其他", "else.png")}>
            <img src="else.png" alt="else.png" />
            <p>其他</p>
          </div>
        </div>
      ) : (
        <div className={budget.iconList}>
          <div onClick={() => handleIncomeItem("薪水", "salary.png")}>
            <img src="salary.png" alt="salary.png" />
            <p>薪水</p>
          </div>
          <div onClick={() => handleIncomeItem("獎金", "bonus.png")}>
            <img src="bonus.png" alt="bonus.png" />
            <p>獎金</p>
          </div>
          <div onClick={() => handleIncomeItem("回饋", "feedback.png")}>
            <img src="feedback.png" alt="feedback.png" />
            <p>回饋</p>
          </div>
          <div onClick={() => handleIncomeItem("交易", "deal.png")}>
            <img src="deal.png" alt="deal.png" />
            <p>交易</p>
          </div>
          <div onClick={() => handleIncomeItem("租金", "collectrent.png")}>
            <img src="collectrent.png" alt="collectrent.png" />
            <p>租金</p>
          </div>
          <div onClick={() => handleIncomeItem("股息", "stock.png")}>
            <img src="stock.png" alt="stock.png" />
            <p>股息</p>
          </div>
          <div onClick={() => handleIncomeItem("投資", "invest.png")}>
            <img src="invest.png" alt="invest.png" />
            <p>投資</p>
          </div>
          <div onClick={() => handleIncomeItem("其他", "else.png")}>
            <img src="else.png" alt="else.png" />
            <p>其他</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Budget;
