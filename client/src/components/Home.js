import React, { Component } from "react";
import Header from "./Header";
import Dashboard from "./Dashboard";
import Report from "./Report";

class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Header updateMe={this.props.updateMe} me={this.props.me} />
        <Dashboard
          updateParking={this.props.updateParking}
          parkingDetails={this.props.parkingDetails}
          me={this.props.me}
          className="left"
        />
        <Report />
      </div>
    );
  }
}

// ({ updateMe, updateParking, me, parkingDetails }) =>

export default Home;
