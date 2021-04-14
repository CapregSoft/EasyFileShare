import React, { useState, Button } from "react";

import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { CopyToClipboard } from "react-copy-to-clipboard";
const Model_app = (props) => {
  return (
    <div>
      <Modal show={props.open} className="modal_show">
        <CopyToClipboard   text={props.url} onCopy={props.copylink } onClick={props.toast}>
          <div className="copy-area">
            <button className="btn_copy_link">Copy Link</button>
            <button className="btn_share">Share</button> 
            <span
              className={`copy-feedback ${props.isCopied ? "active" : ""}`}
            ></span>
          </div>
        </CopyToClipboard>
        {/* <button className="btn_copy_link" onClick={props.copylink}>
          Copy Link
        </button>
        <button className="btn_share">Share</button> */}

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
