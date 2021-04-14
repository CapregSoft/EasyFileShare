import React, { useState, Button } from "react";

import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
const Model_app = (props) => {
  return (
    <div>
      <Modal show={props.open} className="modal_show">
        <button
          className="btn_copy_link"
          onClick={props.copylink}
        >
          Copy Link
        </button>
        <button className="btn_share">Share</button>
        {/* <Modal.Header>
                      <Modal.Title>copy Link</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Share</Modal.Body> */}
        <Modal.Footer>
          <button className="btn" onClick={props.hideModel}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Model_app;
