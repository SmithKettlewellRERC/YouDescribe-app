import React from 'react';
import { Link, browserHistory } from 'react-router';

const SearchBar = (props) => {
  const changeHandler = (e) => {
      e.preventDefault();
      var value = e.target.value;
      // console.log(value);
      props.onChange(value);
  };

  const changeHistory = () => {
    console.log('let go to /seach');
    browserHistory.push('/');
    browserHistory.push('/search');
  };

  return  (
    <div className="search-bar">
      <input type="search" placeholder="Search" width="500" onChange={(e) => changeHandler(e)} />
      {/*<Link to="/search" className="w3-bar-item w3-button">Search</Link>*/}
      <button onClick={() => changeHistory()}>Search</button>
    </div>
  );
}

export default SearchBar;