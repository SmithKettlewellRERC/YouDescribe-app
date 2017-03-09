import React from 'react';
import { Link, browserHistory } from 'react-router';

const SearchBar = (props) => {


  const changeHistory = (e) => {
      e.preventDefault();
      let value = e.target[0].value;
      console.log('at click, the value is: ',value)
      props.onChange(value);
  };
  

  return  (
    <div>
    <form className="search-bar" onSubmit={(e) => changeHistory(e)}>
      <input type="search" placeholder="Search" width="500" />
      <button>Search</button>
    </form>
    </div>
  );
}

export default SearchBar;