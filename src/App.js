import React, { useEffect, useRef, useState } from "react";
import classes from "./App.css";
import Typeahead from "./components/Typeahead/Typeahead";
import githubLogo from "./assets/images/github.png";

function App() {
  const [searchedValue, setSearchedValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [githubUsers, setGithubUsers] = useState([]);
  const [searchedItemClicked, setSearchedItemClicked] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedValue(searchedValue);
    }, 800);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchedValue]);

  useEffect(() => {
    if (debouncedValue.length > 0 && !searchedItemClicked) {
      fetchUsers(debouncedValue);
    } else {
      setGithubUsers([]);
    }
    // eslint-disable-next-line
  }, [debouncedValue]);

  useEffect(() => {
    function handleClickOutsideOfTypeahead(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && !searchedItemClicked) {
        setGithubUsers([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideOfTypeahead);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOfTypeahead);
    };
    // eslint-disable-next-line
  }, [wrapperRef]);

  const fetchUsers = async (username) => {
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${username}&page=0&per_page=100`
      );

      if (!response.ok) {
        console.log("Network response was not ok");
        setGithubUsers([]);
      }

      const result = await response.json();
      if (result.items) {
        setGithubUsers(result.items);
      } else {
        console.log(result.message);
        setGithubUsers([]);
      }
    } catch (err) {
      console.log(err.message || "Something went wrong");
      setGithubUsers([]);
    }
  };

  const inputChangeEventHandler = (event) => {
    const value = event.target.value;
    setSearchedValue(value);
    setSearchedItemClicked(false);
  };

  const searchedItemClickEventHandler = (user) => {
    setSearchedValue(user.login);
    setSearchedItemClicked(true);
    setGithubUsers([]);
    window.open(user.html_url, "_blank");
  };

  const closeButtonClickEventHandler = () => {
    setSearchedValue('');
    setGithubUsers([]);
    setSearchedItemClicked(false);
  }

  return (
    <div className={classes.App}>
      <div className={classes.GithubLogo}>
        <img src={githubLogo} alt="Github logo" />
      </div>
      <h1 className={classes.Heading}>GitHub Users Search Platform</h1>
      <p className={classes.Paragraph}>
        Search GitHub users by their username, click on the desired one and
        navigate to their GitHub page in a new tab.
      </p>
      <div ref={wrapperRef}>
        <Typeahead
          searchedValue={searchedValue}
          items={githubUsers}
          searchedItemClicked={searchedItemClicked}
          onInputChange={(event) => inputChangeEventHandler(event)}
          onSearchedItemClick={(event) => searchedItemClickEventHandler(event)}
          onCloseButtonClick={closeButtonClickEventHandler}
        />
      </div>
    </div>
  );
}

export default App;
