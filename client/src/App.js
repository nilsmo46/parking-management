import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import "./App.css";
import Cookie from "js-cookie";
import Home from "./components/Home";
import Header from "./components/Header";

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      me: null,
      parkingDetails: null,
    };
  }
  getMe = async () => {
    await axios
      .get("http://localhost:4000/api/user/me", { withCredentials: true })
      .then((res) => this.setState({ me: res.data.data }))
      .catch((err) => console.log(err));
  };

  getParkingDetails = async () => {
    await axios
      .get("http://localhost:4000/api/parking/currentStatus", {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({ parkingDetails: res.data.data });
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.getMe();
    this.getParkingDetails();
  }

  render() {
    setTimeout(() => {
      this.getParkingDetails();
    }, 5000);

    if (Cookie.get("token") && this.state.me === null) {
      return (
        <div>
          <h1 className="warning">Loading!!!!!!!!!!!!!!!!!</h1>
        </div>
      );
    }

    if (
      this.state.me === null ||
      (this.state.parkingDetails == null && !Cookie.get("token"))
    ) {
      return (
        <div>
          <Header me={this.state.me} updateMe={this.getMe} />
          <h1 className="warning">Please Register or Login to Continue</h1>
        </div>
      );
    }
    return (
      <div>
        <Home
          me={this.state.me}
          parkingDetails={this.state.parkingDetails}
          updateMe={this.getMe}
          updateParking={this.getParkingDetails}
        />
      </div>
    );
  }
}
