import create from "@/css/Create.module.css";

const Create: React.FC = () => {
  const iconCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  return (
    <>
      <div className={create.space}></div>
      <div className={create.header}>
        <div className={create.icon}>
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div className={create.choose}>
          <div>支出</div>
          <span className={create.vertical}></span>
          <div>收入</div>
        </div>
        <div></div>
      </div>
      <div className={create.iconList}>
        {iconCount.map((icon) => (
          <div key={icon}>{icon}</div>
        ))}
      </div>
      <form className={create.form}>
        <div className={create.iconAndMoney}>
          <label htmlFor="icon">
            <i className="fa-solid fa-bread-slice"></i>
          </label>
          <input id="icon" type="text" />
        </div>
        <div></div>
        <div>
          <input type="text" placeholder="在此輸入備註" />
        </div>
      </form>
    </>
  );
};

export default Create;
