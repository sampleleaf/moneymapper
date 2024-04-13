import edit from "@/css/Edit.module.css";

const Edit: React.FC<{ id: string; setPop: Function }> = ({ id, setPop }) => {
  return (
    <div onClick={() => setPop(false)} className={edit.background}>
        <div className={edit.container}>{id}</div>   
    </div>
  );
};

export default Edit;
