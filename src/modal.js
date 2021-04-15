import React, { useState, Button } from "react";

import Modal from "react-bootstrap/Modal";

import { CopyToClipboard } from "react-copy-to-clipboard";
const ModelApp = ({ url, copylink,  open, isCopied, hideModel }) => {
  return (
    <div>
      <Modal show={open} className="modal_show">
        <CopyToClipboard text={url}>
          <div className="copy-area">
            <button className="btn_copy_link" onClick={copylink}>
              Copy Link
            </button>
            <button className="btn_share">Share</button>
            <button className="btn" onClick={hideModel}>
              Cancel
            </button>
            <span
              className={`copy-feedback ${isCopied ? "active" : ""}`}
            ></span>
          </div>
        </CopyToClipboard>
      </Modal>
    </div>
  );
};
export default ModelApp;
