import React, { useState } from "react";
export const Dropdown = (props) => {
  const { items, active } = props;
  console.log(active,'active')
  const [displayMenu, setDisplayMenu] = useState(false);
  const [title, setTitle] = useState(active.key);
  const showDropdownMenu = () => setDisplayMenu(!displayMenu);

  const hideDropdownMenu = (v) => {
    setDisplayMenu(false);
    setTitle(v);
  };

  return (
    <>
      <div
        style={{ position: "fixed", inset: "0px" }}
        onClick={() => setDisplayMenu(false)}
      ></div>
      <div className="dropdown">
        <div className="button" onClick={() => showDropdownMenu()}>
          {active.name}
          <div className="triangle_button">
            <i className="triangle"></i>
          </div>
        </div>
        {displayMenu && (
          <div className="menu">
            {items.map((item) => (
              <div
                className={item.key === title && "active"}
                onClick={() => hideDropdownMenu(item.key)}
                key={item.key}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
