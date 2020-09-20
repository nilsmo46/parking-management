import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardSubtitle,
  Button,
  Container,
  Row,
  Col,
  Input,
  Spinner,
} from "reactstrap";
import ModalComponent from "./ModalComponent";
import axios from "axios";

class CardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicleId: "",
      showModal: false,
      space: "",
      zone: "",
      currentVehicle: "",
      currentBooking: "",
      spaceId: "",
      zoneId: "",
      showSpinner: false,
    };
  }
  toggle = () => this.setState(this.setState({ showModal: false }));

  bookOrRelease = async () => {
    if (this.state.currentVehicle) {
      axios
        .post(
          "http://localhost:4000/api/parking/releaseParking",
          {
            vehicle_id: this.state.currentVehicle,
            parking_space_id: this.state.spaceId,
            booking_id: this.state.currentBooking,
          },
          { withCredentials: true }
        )
        .then(await this.props.updateParking());
    } else {
      axios
        .post(
          "http://localhost:4000/api/parking/bookParking",
          {
            vehicle_id: this.state.vehicleId,
            parking_space_id: this.state.spaceId,
            parking_zone_id: this.state.zoneId,
          },
          { withCredentials: true }
        )
        .then(await this.props.updateParking());
    }
    this.setState({ showSpinner: false });
    this.toggle();
  };

  onButtonClick = (space, zone, vehicle, currentbooking, spaceid, zoneid) => {
    this.setState({
      showModal: true,
      space,
      zone,
      spaceId: spaceid,
      zoneId: zoneid,
      currentVehicle: vehicle,
      currentBooking: currentbooking,
      showSpinner: true,
    });
  };

  modalBody = {
    body: () => (
      <div>
        <label>
          {this.state.currentVehicle
            ? "Enter Vehicle Number"
            : "Current Vehicle"}
        </label>
        <Input
          placeholder="Enter Vehicle Number"
          value={
            this.state.currentVehicle
              ? this.state.currentVehicle
              : this.state.vehicleId
          }
          onChange={(e) => this.setState({ vehicleId: e.target.value })}
          disabled={this.state.currentVehicle}
        />
        <span>Parking Space {this.state.space}</span>
        <br />
        <span>Parking Zone {this.state.zone}</span>
      </div>
    ),
    footer: () => (
      <div>
        <Button color="success" onClick={() => this.bookOrRelease()}>
          {this.state.currentVehicle ? "Release" : "Book"}
        </Button>
      </div>
    ),
  };
  render() {
    return (
      <div>
        {this.state.showSpinner && <Spinner />}
        <Container fluid className="left">
          {this.props.parkingDetails &&
            this.props.parkingDetails.map((parking) => (
              <div className="row-margin">
                <div>{`Parking Zone ${parking.title}`}</div>
                <Row md={4} key={parking.title}>
                  {parking.parking_space.map((space) => (
                    <Col>
                      <Card>
                        <CardBody>
                          <CardSubtitle>{space.title}</CardSubtitle>
                          {space.currentVehicle && (
                            <CardSubtitle>{space.currentVehicle}</CardSubtitle>
                          )}
                          {this.props.type === "Booking_Counter_Agent" && (
                            <Button
                              color={
                                space.currentVehicle ? "secondary" : "success"
                              }
                              className="button-spacing"
                              onClick={() =>
                                this.onButtonClick(
                                  space.title,
                                  space.parking_zone,
                                  space.currentVehicle,
                                  space.currentBooking,
                                  space._id,
                                  parking._id
                                )
                              }
                            >
                              {space.currentVehicle ? "Release" : "Book"}
                            </Button>
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
        </Container>
        <ModalComponent
          showModal={this.state.showModal}
          toggle={this.toggle}
          modalHeader="Enter Details"
          modalBody={this.modalBody}
        />
      </div>
    );
  }
}

export default CardComponent;
