import detailNote from "@/css/DetailNote.module.css";
import useDetailNoteData from "@/utils/hook/useDetailNoteData";

const PayNote: React.FC<{
  popItem: string | number;
  total: string | number;
  day: string;
  months: number;
  years: number;
}> = ({ popItem, total, day, months, years }) => {

  const items = useDetailNoteData(years, months, day, popItem as string, false)

  const totalPriceOfItems =
    items &&
    items.reduce((acc, cur) => {
      return acc + cur.price;
    }, 0);

  const chineseDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  return (
    <>
      <div className={detailNote.container}>
        {items && items?.length > 0 && (
          <div className={detailNote.dayRemainder}>
            <p>
              {years}/{months}/{day} {`${chineseDays[new Date(`${years}-${months}-${day}`).getDay()]}`}
            </p>
            <p>${Math.abs(totalPriceOfItems as number)}</p>
          </div>
        )}
        <div className={detailNote.dayItems}>
          {items &&
            items.map((item) => (
              <div key={item.id} className={detailNote.itemGroup}>
                <div className={detailNote.percentGroup}>
                  <div className={detailNote.percent}>
                    <p>{item.note || item.item}</p>
                    <p style={{color: "rgb(254,116,113)"}}>{Math.abs(item.price / (total as number) * 100).toFixed(2)}%</p>
                  </div>
                  <div className={detailNote.percentBarContainer}>
                    <div className={detailNote.percentBar}></div>
                    <div className={detailNote.displayPercent} style={{width: `${Math.abs(item.price / (total as number) * 100).toFixed(2)}%`, backgroundColor: "rgb(254,116,113)"}}></div>
                  </div>
                </div>
                <p>${Math.abs(item.price)}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default PayNote;
