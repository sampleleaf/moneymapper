import budget from "@/css/Budget.module.css";

const Budget: React.FC<{
  payPage: boolean;
  setPayPage: (boolean: boolean) => void;
  setPayItem: React.Dispatch<React.SetStateAction<string[]>>;
  setIncomeItem: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ payPage, setPayPage, setPayItem, setIncomeItem }) => {
  const payItemArray = [
    ["早餐", "breakfast"],
    ["午餐", "lunch"],
    ["晚餐", "dinner"],
    ["飲品", "drinks"],
    ["點心", "dessert"],
    ["交通", "transport"],
    ["購物", "shopping"],
    ["娛樂", "joy"],
    ["房租", "home"],
    ["醫療", "medical"],
    ["其他", "else"],
  ];
  const incomeItemArray = [
    ["薪水", "salary"],
    ["獎金", "bonus"],
    ["回饋", "feedback"],
    ["交易", "deal"],
    ["租金", "rent"],
    ["股息", "stock"],
    ["投資", "finance"],
    ["其他", "else"],
  ];

  return (
    <>
      <div className={budget.header}>
        <div
          className={budget.triggerPage}
          style={
            payPage
              ? { backgroundColor: "rgb(255, 193, 190)" }
              : {
                  transform: "translateX(100%)",
                  backgroundColor: "rgb(158,225,255)",
                }
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
          {payItemArray.map((payItem) => (
            <div key={payItem[0]} onClick={() => setPayItem(payItem)}>
              <img src={`images/${payItem[0]}.png`} alt={payItem[0]} />
              <p>{payItem[0]}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={budget.iconList}>
          {incomeItemArray.map((incomeItem) => (
            <div key={incomeItem[0]} onClick={() => setIncomeItem(incomeItem)}>
              <img src={`images/${incomeItem[0]}.png`} alt={incomeItem[0]} />
              <p>{incomeItem[0]}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Budget;
