import React from 'react';
import { Link, browserHistory } from 'react-router';

const SearchBar = (props) => {


  const updateSearch = (e) => {
      e.preventDefault();
      let value = e.target[0].value;
      console.log('at click, the value is: ',value)
      props.updateSearch(value);
  };
  

  return  (
    <div>
    <form className="search-bar" onSubmit={(e) => updateSearch(e)}>
      <input type="search" placeholder="Search" width="500" />
      <button>Search</button>
    </form>
    </div>
  );
}

export default SearchBar;