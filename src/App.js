import React, { Component } from "react";
import AWS from "aws-sdk";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa";
import QRCode from "qrcode.react";
import { Progress } from "react-sweet-progress";

import { ToastContainer, toast } from "react-toastify";
import "react-sweet-progress/lib/style.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./modal.css";
import ModelApp from "./modal";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET,
});

class App extends Component {
  state = {
    // Initially, no file is selected
    copied: false,
    selectedFile: null,
    bgColour: "#fafafa",
    fileUrl: "",
    progress: "",
    isOpen: false,
    url: "hello",
    toast: "",
    isCopied: false,
    myBucket: new AWS.S3({
      params: { Bucket: process.env.REACT_APP_S3_BUCKET },
      region: process.env.REACT_APP_S3_BUCKET_REGION,
    }),
  };
  show_modal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  hideModal = () => {
    this.setState({ isOpen: false });
  };

  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    if (event.target.files.length > 0) {
      this.setState({ selectedFile: event.target.files[0] });
      console.log(process.env.REACT_APP_S3_BUCKET_REGION);

      const params = {
        ACL: "public-read",
        Key: event.target.files[0].name,
        ContentType: event.target.files[0].type,
        Body: event.target.files[0],
      };
      this.state.myBucket
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
          this.setState({
            progress: Math.round((evt.loaded / evt.total) * 100),
          });
          console.log(this.state.progress);
          if (this.state.progress === 100) {
            const url = `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_BUCKET_REGION}.amazonaws.com/${this.state.selectedFile.name}`;
            this.setState({
              fileUrl: url,
            });
          }
        })
        .send((err) => {
          if (err) {
            console.log("🚀 ~ file: App.js ~ line 43 ~ App ~ .send ~ err", err);
          }
        });
    }

    // return `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_BUCKET_REGION}.amazonaws.com/${this.state.selectedFile.name}`
  };

  // On file upload (click the upload button)
  Copy = () => {
    var textField = document.createElement("textarea");
    textField.innerText = this.state.fileUrl;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();

    // alert("Copied the text: " + Url.value);
  };
  fileData = () => {
    if (this.state.selectedFile) {
      if (this.state.fileUrl != "") {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              color: "white",
              justifyContent: "center",
            }}
          >
             <div className="qrcode" >
              <QRCode
                includeMargin={true}
                size={70}
                value={this.state.fileUrl}
              />
            </div> 
            
            <p className="file_url"> 
           <i> {this.state.fileUrl !== "" ? "" + this.state.fileUrl : ""}</i>
            </p>
            <p></p>
            <p>
              {<BsThreeDotsVertical
                size={30}
                color="white"
                onClick={this.show_modal}
              /> 
              
              }
            </p>
          </div>
        );
      } else {
        return (
          <div style={{ margin: 50 }}>
            <Progress
              // type="circle"
              width={500}
              percent={this.state.progress}
              theme={{
                success: {
                  symbol: "🏄‍",
                  color: "rgb(223, 105, 180)",
                },
                active: {
                  symbol: "😀",
                  color: "#fbc630",
                },
                default: {
                  symbol: "😱",
                  color: "#fbc630",
                },
              }}
            />
          </div>
        );
      }
    } else {
      return (
        <div>
          <div
            className="image-upload"
            style={{ background: `${this.state.bgColour}` }}
            onMouseEnter={() => this.setState({ bgColour: "#c83f49" })}
            onMouseLeave={() => this.setState({ bgColour: "#fafafa" })}
          >
            <label for="file-input">
              <div className="upload">
                <FaFolderOpen color="blue"  size={50} style={{marginLeft:'5px'}}/>
              </div>
            </label>

            <input id="file-input" type="file" onChange={this.onFileChange} />
          </div>
          <div style={{ fontFamily: "cursive", fontSize: 30, color: "white" }}>
            <h3>Upload file here</h3>
          </div>
        </div>
      );
    }
  };
 onCopyText = () => {
    this.setState({ url: this.fileUrl });
    toast.success("Link is copied");
  };

  render() {
    return (
      <div className="App">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            color: "white",
            justifyContent: "center",
            marginTop: 200,
            fontFamily: "cursive",
            fontSize: 30,
          }}
        >
          
           <img src="file_logo.png" className="image_logo"/>
        </div>
        {this.fileData()}

        <ModelApp
          open={this.state.isOpen}
          hideModel={this.hideModal}
          copylink={this.onCopyText}
          url={this.state.fileUrl}
        />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
       
      </div>
    );
  }
}

export default App;
