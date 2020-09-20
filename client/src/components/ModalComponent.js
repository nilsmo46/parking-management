import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ModalComponent = ({ showModal, toggle, modalHeader, modalBody }) => {
  return (
    <Modal isOpen={showModal} toggle={toggle}>
      <ModalHeader>{showModal && modalHeader}</ModalHeader>
      <ModalBody>{modalBody.body()}</ModalBody>
      <ModalFooter>{modalBody.footer()}</ModalFooter>
    </Modal>
  );
};

export default ModalComponent;
