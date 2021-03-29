import React, { Component } from 'react';
import './App.css';
import AWS from 'aws-sdk';
import { IconContext } from 'react-icons'
import { FaFolderOpen,BsCloudUpload } from "react-icons/fa";
import { BsCloudUpload } from "react-icons/di";



AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET
})

class App extends Component {
  state = {
    // Initially, no file is selected 
    selectedFile: null,
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
    this.setState({ selectedFile: event.target.files[0] });
  };

  // On file upload (click the upload button) 
  onFileUpload = () => {
    console.log(process.env.REACT_APP_S3_BUCKET_REGION);

    const params = {
      ACL: 'public-read',
      Key: this.state.selectedFile.name,
      ContentType: this.state.selectedFile.type,
      Body: this.state.selectedFile,
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

    return `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_BUCKET_REGION}.amazonaws.com/${this.state.selectedFile.name}`
  };

  fileData = () => {
    if (this.state.selectedFile) {

      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>Progress: {this.state.progress}</p>
          <p> {this.state.fileUrl !== "" ? "File Url: " + this.state.fileUrl : ""}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="App">
        div
        <h1>
          Easy File Share
            </h1>
          <div class="image-upload">
            <label for="file-input">
                <div style={{ background: 'white',height:50, width: 50,borderRadius:50,padding:20,justifyContent:'center',alignItems:'center'}}>
                  <FaFolderOpen size={40} color="blue"/>
                </div>
            </label>

            <input id="file-input" type="file" onChange={this.onFileChange} />
          </div>
          <button onClick={this.onFileUpload}>
            Upload
          </button>
        {this.fileData()}
      </div>

    );
  }
}

export default App;
