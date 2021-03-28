import React, { Component } from 'react';
import './App.css'
import AWS from 'aws-sdk'

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
        <h3>
          File Upload using React!
            </h3>
        <div>
          <input type="file" onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>
            Upload!
          </button>
        </div>
        {this.fileData()}
      </div>
    );
  }
}

export default App;
