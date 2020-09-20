import React, { useState } from "react";
import ModalComponent from "./ModalComponent";
import DropdownComponent from "./DropdownComponent";
import Cookie from "js-cookie";
import { Button, Input } from "reactstrap";
import axios from "axios";

const Header = ({ updateMe, me }) => {
  const [showModal, setModal] = useState(false);
  const [showDropdown, setDropdown] = useState(false);
  const [modalText, setModalText] = useState("");
  const [selectedDropdown, setselectedDropdown] = useState("");
  const [selectedDropdownValue, setselectedDropdownValue] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const toggle = () => setModal(false);
  const toggleDropdown = () => setDropdown((prevState) => !prevState);
  const setDropdownText = (value) => setselectedDropdown(value);

  const roles = [
    {
      name: "Parking Zone Assistant",
      value: "Parking_Zone_Assistant",
    },
    {
      name: "Booking Counter Agent",
      value: "Booking_Counter_Agent",
    },
  ];

  const registerUser = () => {
    if (modalText === "Register") {
      axios
        .post("http://localhost:4000/api/user/register", {
          name,
          email,
          password,
          role: selectedDropdownValue,
        })
        .then((res) => {
          Cookie.set("token", res.data.token);
          updateMe();
          toggle();
        });
    } else {
      axios
        .post(
          "http://localhost:4000/api/user/login",
          {
            email,
            password,
          },
          { withCredentials: true }
        )
        .then((res) => {
          Cookie.set("token", res.data.token);
          updateMe();
          toggle();
        });
    }
  };

  const modalBody = {
    body: () => (
      <div>
        {modalText === "Register" && (
          <div>
            <label>Enter Your Name</label>
            <Input
              placeholder="Name"
              onChange={(e) => setname(e.target.value)}
            />
          </div>
        )}
        <label>Enter Email</label>
        <Input placeholder="Email" onChange={(e) => setemail(e.target.value)} />
        <label>Enter Password</label>
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setpassword(e.target.value)}
        />
        {modalText === "Register" && (
          <div>
            <label>Select Your Role</label>
            <DropdownComponent
              showDropdown={showDropdown}
              toggleDropdown={toggleDropdown}
              selectedDropdown={selectedDropdown}
              setselectedDropdownValue={setselectedDropdownValue}
              roles={roles}
              setDropdownText={setDropdownText}
            />
          </div>
        )}
      </div>
    ),
    footer: () => (
      <div>
        <Button onClick={() => registerUser()}>{modalText}</Button>
      </div>
    ),
  };
  return (
    <div className="navbar">
      <h1>Parking Management System</h1>
      <h2>
        {me ? (
          `Hi ${me.email}`
        ) : (
          <div>
            <Button
              color="success"
              onClick={() => {
                setModal(true);
                setModalText("Register");
              }}
            >
              Register
            </Button>
            <Button
              color="link"
              onClick={() => {
                setModal(true);
                setModalText("Login");
              }}
            >
              Login
            </Button>
          </div>
        )}
      </h2>
      <ModalComponent
        showModal={showModal}
        toggle={toggle}
        modalHeader={modalText}
        modalBody={modalBody}
      />
    </div>
  );
};

export default Header;
