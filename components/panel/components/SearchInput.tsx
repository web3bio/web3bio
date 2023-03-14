import { useRef } from "react";
import SVG from "react-inlinesvg";
export const SearchInput = (props) => {
  const { key, defaultValue, handleSubmit } = props;
  const inputRef = useRef(null);
  const emitSubmit = (e) => {
    e.preventDefault();
    const ipt = inputRef.current;
    if (!ipt) return;
    handleSubmit(ipt.value);
  };
  return (
    <>
      <input
        ref={inputRef}
        key={key}
        type="text"
        placeholder="Search Twitter, Lens, ENS or Ethereum"
    
        defaultValue={defaultValue}
        className="form-input input-lg"
        autoCorrect="off"
        autoFocus
        spellCheck="false"
        id="searchbox"
      />
      <button
        type="submit"
        title="Submit"
        className="form-button btn"
        onClickCapture={emitSubmit}
      >
        <SVG
          src="icons/icon-search.svg"
          width={24}
          height={24}
          className="icon"
        />
      </button>
    </>
  );
};
