import React, { Component } from 'react';
import './App.css';
import AWS from 'aws-sdk';
import { FaFolderOpen } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";



AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET
})

class App extends Component {
  state = {
    // Initially, no file is selected 
    copied: false,
    selectedFile: null,
    bgColour: '#fafafa',
    fileUrl: "",
    progress: "",
    myBucket: new AWS.S3({
      params: { Bucket: process.env.REACT_APP_S3_BUCKET },
      region: process.env.REACT_APP_S3_BUCKET_REGION,
    })
  };


  // On file select (from the pop up) 
  onFileChange = event => {
    // Update the state 
    if (event.target.files.length > 0) {
      this.setState({ selectedFile: event.target.files[0] });
      console.log(process.env.REACT_APP_S3_BUCKET_REGION);

      const params = {
        ACL: 'public-read',
        Key: event.target.files[0].name,
        ContentType: event.target.files[0].type,
        Body: event.target.files[0]
      }
      this.state.myBucket.putObject(params)
        .on('httpUploadProgress', (evt) => {
          this.setState({
            progress: Math.round((evt.loaded / evt.total) * 100),
          })
          console.log(this.state.progress);
          if (this.state.progress === 100) {
            this.setState({
              fileUrl: `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_BUCKET_REGION}.amazonaws.com/${this.state.selectedFile.name}`,
            })
          }
        })
        .send((err) => {
          if (err) {
            console.log("🚀 ~ file: App.js ~ line 43 ~ App ~ .send ~ err", err)
          }
        })
    }

    // return `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_BUCKET_REGION}.amazonaws.com/${this.state.selectedFile.name}`
  };

  // On file upload (click the upload button) 
  Copy = () => {

    var textField = document.createElement('textarea')
    textField.innerText = this.state.fileUrl
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    

    // alert("Copied the text: " + Url.value);
  }
  fileData = () => {
    if (this.state.selectedFile) {
      if (this.state.fileUrl != "") {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              color: 'white',
              justifyContent: 'center',

            }}
          >

            <p ><QRCode size={100} value={this.state.fileUrl} /></p>
            {/* <h2>File Details:</h2>
            <p>File Name: {this.state.selectedFile.name}</p>
            <p>File Type: {this.state.selectedFile.type}</p>
            <p>Progress: {this.state.progress}</p> */}
            <p>
              {this.state.fileUrl !== "" ? "File Url: " + this.state.fileUrl : ""}
            </p>
            <p>

            </p>
            <p>
              {/* <select id="dropdown" value=":">
                <option value="Copy Link">
                  <CopyToClipboard text={this.state.fileUrl}
                    onCopy={() => this.setState({ copied: true })}>
                    <span>Copy to clipboard with button</span>
                  </CopyToClipboard>
                </option>
              </select> */}
              <select id="dropdown">
                <option value="Copy Link" onClick={this.Copy}>Copy Link</option>
                <option value="Share Link">Share Link</option>
              </select>
            </p>
          </div>
        );
      }
      else {
        return (
          <div style={{ margin: 50 }}>
            <Progress
              // type="circle"
              width={500}
              percent={this.state.progress}
              theme={{
                success: {
                  symbol: '🏄‍',
                  color: 'rgb(223, 105, 180)'
                },
                active: {
                  symbol: '😀',
                  color: '#fbc630'
                },
                default: {
                  symbol: '😱',
                  color: '#fbc630'
                }
              }}
            />
          </div>
        );
      }
    } else {
      return (
        <div>
          <div
            className="image-upload" style={{ background: `${this.state.bgColour}` }}
            onMouseEnter={() => this.setState({ bgColour: '#c83f49' })}
            onMouseLeave={() => this.setState({ bgColour: '#fafafa' })}>
            <label for="file-input">
              <div className="upload">
                <FaFolderOpen size={60} color="blue" />
              </div>
            </label>

            <input id="file-input" type="file" onChange={this.onFileChange} />

          </div>
          <div style={{ fontFamily: 'cursive', fontSize: 30, color: 'white' }}>
            <h3>Upload file here</h3>
          </div>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="App">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          color: 'white',
          justifyContent: 'center',
          marginTop: 200,
          fontFamily: 'cursive',
          fontSize: 30
        }}>
          <FaCloudUploadAlt size={70} color="white" />
          <h1>
            <i>Easy File Share</i>
          </h1>
        </div>
        {this.fileData()}
      </div>

    );
  }
}

export default App;
