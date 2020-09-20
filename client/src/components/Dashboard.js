import React, { Component } from "react";
import axios from "axios";
import { Button } from "reactstrap";
import CardComponent from "./CardComponent";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parkingComplete: props.parkingDetails,
      parkingFiltered: props.parkingDetails,
      isFiltered: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      parkingComplete: props.parkingDetails,
    };
  }
  initParking = () => {
    axios
      .get("http://localhost:4000/api/parking/init", {
        withCredentials: true,
      })
      .then(this.props.updateParking());
  };

  filter = (filter) => {
    if (filter === "N") {
      this.setState({
        isFiltered: false,
      });
    } else {
      const filtered = this.state.parkingComplete.filter(
        (parking) => parking.title === filter
      );
      this.setState({ parkingFiltered: filtered, isFiltered: true });
    }
  };

  render() {
    return (
      <div>
        {this.props.me.type === "Booking_Counter_Agent" && (
          <Button onClick={() => this.initParking()} className="button-spacing">
            Initialize Parking
          </Button>
        )}
        <Button onClick={() => this.filter("N")} className="button-spacing">
          All
        </Button>
        <Button onClick={() => this.filter("A")} className="button-spacing">
          A
        </Button>
        <Button onClick={() => this.filter("B")} className="button-spacing">
          B
        </Button>
        <Button onClick={() => this.filter("C")} className="button-spacing">
          C
        </Button>

        <CardComponent
          parkingDetails={
            this.state.isFiltered
              ? this.state.parkingFiltered
              : this.state.parkingComplete
          }
          type={this.props.me.type}
          updateParking={this.props.updateParking}
        />
      </div>
    );
  }
}

export default Dashboard;
