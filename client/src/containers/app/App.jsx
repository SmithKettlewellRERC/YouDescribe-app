import React, { Component } from 'react';
import Navbar from '../../components/navbar/Navbar.jsx';
import NavbarMaterial from '../../components/navbar/Navbar(material).jsx';
import Footer from '../../components/footer/Footer.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };

    this.updateState = this.updateState.bind(this);
    this.getState = this.getState.bind(this);
  }

  getState() {
    return this.state;
  }

  updateState(stateObj) {
    this.setState(stateObj);
  }

  componentDidMount() {
    // console.log('componentDidMount');
  }

  updateSearch(searchValue) {
    this.setState({
      search: searchValue,
    })

  }

  render() {
    return (
      <div>
        <Navbar updateSearch={(searchValue) => this.updateSearch(searchValue)} />
        {React.cloneElement(this.props.children, {
          state: this.state,
          updateState: this.updateState,
          getState: this.getState,
        })}
        <Footer />
      </div>
    );
  }
}

export default App;
