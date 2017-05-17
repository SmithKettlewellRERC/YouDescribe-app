import React, {Component} from 'react';

class NotFound extends Component {
  componentDidMount() {
    document.getElementById('not-found').focus();
  }

  render() {
    return (
      <div id="not-found" tabIndex="-1" className="w3-center">
        <main>
          <h2>Not Found</h2>
        </main>
      </div>
    );
  }
}

export default NotFound;
