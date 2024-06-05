import detailNote from "@/css/DetailNote.module.css";
import { chineseDays } from "@/utils/constant";
import useDetailNoteData from "@/utils/hook/useDetailNoteData";

const IncomeNote: React.FC<{
  popItem: string | number;
  total: string | number;
  day: string;
  months: number;
  years: number;
}> = ({ popItem, total, day, months, years }) => {
  const {items, totalPriceOfItems} = useDetailNoteData(years, months, day, popItem as string, false);

  return (
    <>
      {items && items?.length > 0 && (
        <div className={detailNote.container}>
          <div className={detailNote.dayRemainder}>
            <p>
              {years}/{months}/{day}{" "}
              {`星期${
                chineseDays[new Date(`${years}-${months}-${day}`).getDay()]
              }`}
            </p>
            <p>${Math.abs(totalPriceOfItems as number)}</p>
          </div>
          {items.map((item) => (
            <div key={item.id} className={detailNote.dayItems}>
              <div className={detailNote.itemGroup}>
                <div className={detailNote.percentGroup}>
                  <div className={detailNote.percent}>
                    <p>{item.note || item.item}</p>
                    <p style={{ color: "rgb(158,225,255)" }}>
                      {Math.abs((item.price / (total as number)) * 100).toFixed(
                        2
                      )}
                      %
                    </p>
                  </div>
                  <div className={detailNote.percentBarContainer}>
                    <div className={detailNote.percentBar}></div>
                    <div
                      className={detailNote.displayPercent}
                      style={{
                        width: `${Math.abs(
                          (item.price / (total as number)) * 100
                        ).toFixed(2)}%`,
                        backgroundColor: "rgb(158,225,255)",
                      }}
                    ></div>
                  </div>
                </div>
                <p>${Math.abs(item.price)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default IncomeNote;
