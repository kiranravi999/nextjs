import "./App.css";





const SavedInterests = (props) => {
  const { item, Changed } = props;

  const onClickCheckBox = () => {
    Changed(item);
  };
  return (
    <div>
      <input
        type="checkbox"
        checked={item.ischecked}
        onChange={onClickCheckBox}
        className="mr-2 bg-dark m-0 p-0"
      />
      <label className=" m-0 mb-1">{item.category}</label>
    </div>
    
  );
};
export default SavedInterests;
