import { driver, Config, DriveStep } from "driver.js";

export const driverStep0 = () =>
  driver({
    steps: [
      {
        element: "#add",
        popover: {
          title: "記一筆新帳",
          description: "跳轉到記帳頁面",
          side: "top",
          align: "center",
        },
      },
      // More steps...
    ],
  }).drive();

export const driverStep3 = () =>
  driver({
    steps: [
      {
        element: "#item",
        popover: {
          title: "編輯和刪除",
          description: "點選項目就會彈出編輯視窗<br>點選垃圾桶可以刪出項目",
          side: "top",
          align: "center",
        },
      },
      // More steps...
    ],
  }).drive();

type HomeDriver = (days: string[]) => {
  isActive: () => boolean;
  refresh: () => void;
  drive: (stepIndex?: number) => void;
  setConfig: (config?: Config) => void;
  setSteps: (steps: DriveStep[]) => void;
  destroy: () => void;
};

export const homeDriver: HomeDriver = (days) =>
  driver({
    showProgress: true,
    steps: [
      {
        element: "#add",
        popover: {
          title: "記一筆新帳",
          description: "跳轉到記帳頁面",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#item",
        popover: {
          title: Object.keys(days).length > 0 ? "編輯和刪除" : "教學",
          description:
            Object.keys(days).length > 0
              ? "點選項目就會彈出編輯視窗<br>點選垃圾桶可以刪出項目"
              : "先記一筆帳才有後續教學喔!",
          side: "top",
          align: "center",
        },
      },
      // More steps...
    ],
  });

export const createDriver = () =>
  driver({
    showProgress: true,
    steps: [
      {
        element: ".calendarDriver",
        popover: {
          title: "確認日期",
          description: "可以點選來選擇日期",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#budget",
        popover: {
          title: "選擇支出或收入",
          description: "可以切換不同圖示，圖示可以點選",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#itemResult",
        popover: {
          title: "確認項目",
          description: "點選的圖示，會顯示在這邊",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#price",
        popover: {
          title: "金額",
          description: "必填欄位，只能輸入數字",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#note",
        popover: {
          title: "備註",
          description: "選填欄位，給喜歡詳細記錄的您",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#location",
        popover: {
          title: "地區",
          description: "選填欄位，想查看地區收支記得要填",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#submit",
        popover: {
          title: "提交",
          description: "確認填寫無誤的話，就送出吧!",
          side: "top",
          align: "center",
        },
      },
      // More steps...
    ],
  }).drive();

export const mapperDriver = () =>
  driver({
    showProgress: true,
    steps: [
      {
        element: "#selectMap",
        popover: {
          title: "切換偵測地區的方式",
          description:
            "自動：點擊地圖會偵測您所在的地區<br>手動：點擊地圖會偵測您選擇的地區",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#mapper",
        popover: {
          title: "點地圖",
          description: "點完後就會顯示您的地區平均收支",
          side: "top",
          align: "center",
        },
      },
      {
        popover: {
          title: "貼心提醒",
          description: "記帳時有記錄地區才會顯示喔!",
          align: "center",
        },
      },
      // More steps...
    ],
  }).drive();

type DetailDriver = (chartData: (string | number)[][], title: string, item: string, content: string) => {
  isActive: () => boolean;
  refresh: () => void;
  drive: (stepIndex?: number) => void;
  setConfig: (config?: Config) => void;
  setSteps: (steps: DriveStep[]) => void;
  destroy: () => void;
};

export const detailDriver: DetailDriver = (chartData, title, item, content) =>
  driver({
    showProgress: true,
    steps: [
      {
        element: "#list",
        popover: {
          title: chartData.length > 0 ? `${title}` : "教學",
          description:
            chartData.length > 0
              ? `點選項目可以看到${item}明細`
              : `先記一筆${content}才有後續教學喔!`,
          side: "top",
          align: "center",
        },
      },
      // More steps...
    ],
  });
