import React from "react";
import classes from "./Typeahead.css";
import closeIcon from "../../assets/icons/close.svg";

const Typeahead = (props) => {
  const renderResults = () => {
    return props.items.length === 0 ? null : (
      <ul>
        {props.items.map((element) => (
          <li
            key={element.id}
            onClick={() => props.onSearchedItemClick(element)}
          >
            <img src={element.avatar_url} alt="GitHub user avatar" />
            {element.login}
          </li>
        ))}
      </ul>
    );
  };

  const renderCloseButton = () => {
    return props.items.length > 0 || props.searchedItemClicked ? (
      <div className={classes.Close} onClick={props.onCloseButtonClick}>
        <img src={closeIcon} alt="Close Github typeahead" />
      </div>
    ) : null;
  };

  return (
    <div className={classes.Typeahead}>
      <input
        onChange={props.onInputChange}
        placeholder="Enter the username to search..."
        value={props.searchedValue}
        type="text"
      />
      {renderResults()}
      {renderCloseButton()}
    </div>
  );
};

export default Typeahead;
