import React from "react";
import DatePicker from "react-datepicker";
import axios from "axios";

import "react-datepicker/dist/react-datepicker.css";

export default class Report extends React.Component {
  state = {
    startDate: new Date(),
    date: "",
    month: "",
    year: "",
    reportData: [],
  };

  handleChange = (fulldate, date, month, year) => {
    this.setState({
      startDate: fulldate,
      date,
      month,
      year,
    });
    axios
      .post(
        "http://localhost:4000/api/parking/report",
        {
          date,
          month,
          year,
        },
        { withCredentials: true }
      )
      .then((res) => this.setState({ reportData: res.data.data }));
  };

  render() {
    return (
      <div className="right">
        <h2>Select a Date to see the Report</h2>
        <DatePicker
          selected={this.state.startDate}
          onChange={(date) =>
            this.handleChange(
              date,
              date.getDate(),
              date.getMonth() + 1,
              date.getFullYear()
            )
          }
        />
        {this.state.reportData.length > 0 ? (
          <div>
            <table className="table-report">
              <thead>
                <th className="tdata">Vehicle ID</th>
                <th className="tdata">Parking Zone</th>
                <th className="tdata">Parking Space</th>
                <th className="tdata">Booking Time</th>
                <th className="tdata">Releae Time</th>
              </thead>
              <tbody>
                {this.state.reportData.map((report, index) => (
                  <tr key={index}>
                    <td className="tdata">{report.vehicle_id}</td>
                    <td className="tdata">
                      {report.parking_space_id.parking_zone}
                    </td>
                    <td className="tdata">{report.parking_space_id.title}</td>
                    <td className="tdata">
                      {new Date(report.booking_date_time).toTimeString()}
                    </td>
                    <td className="tdata">
                      {new Date(report.release_date_time).toTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No Reports for the selected day</div>
        )}
      </div>
    );
  }
}
