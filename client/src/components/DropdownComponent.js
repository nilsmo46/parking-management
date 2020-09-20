import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const DropdownComponent = ({
  showDropdown,
  toggleDropdown,
  selectedDropdown,
  roles,
  setDropdownText,
  setselectedDropdownValue,
}) => (
  <Dropdown isOpen={showDropdown} toggle={toggleDropdown}>
    <DropdownToggle caret>
      {selectedDropdown || "Select Your Role"}
    </DropdownToggle>
    <DropdownMenu>
      {roles.map((role) => (
        <DropdownItem
          onClick={() => {
            setDropdownText(role.name);
            setselectedDropdownValue(role.value);
          }}
        >
          {role.name}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </Dropdown>
);

export default DropdownComponent;
