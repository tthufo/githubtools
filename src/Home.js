import React, { Component } from 'react';
import GitHubLogin from '../src/auth/GitHubLogin';
import API from './api/API'
import ReactDropzone from "react-dropzone";
import readXlsxFile from 'read-excel-file'
import Search from '../src/component/search'
import logo from '../src/img/Nexus.png'
import check from '../src/img/check.png'

import {
  Card, Button,
} from 'reactstrap';

import DownLoad from '../src/component/download';
 
const Load = ({complete}) => (
  <div style={{ 
    backgroundColor: 'white',
    opacity: 0.9,
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute', 
    width: '100%', height: '100%' }}>
      {complete ? 
      <img style={{ alignSelf: 'center' }} src={check} width='85' height='80' alt='check' /> :
      <div class="spinner-border text-primary" 
        style={{
        width: '3rem', 
        height: '3rem' 
        }} 
        role="status">
        <span class="sr-only">Loading...</span>
      </div> 
      }
    </div>
);

function smartTrim(string, maxLength) {
  if (!string || string === 'Import excel file') return string;
  if (maxLength < 1) return string;
  if (string.length <= maxLength) return string;
  if (maxLength === 1) return string.substring(0,1) + '...';

  var midpoint = Math.ceil(string.length / 2);
  var toremove = string.length - maxLength;
  var lstrip = Math.ceil(toremove/2);
  var rstrip = toremove - lstrip;
  return string.substring(0, midpoint-lstrip) + '...' 
  + string.substring(midpoint+rstrip);
}  

const styles = {
  uploadfile_error: {
    display: 'flex',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#F2F2F2',
    border: '2px dashed red',
    marginTop: 10,
    overflow:'elipsis'
  },
  uploadfile: {
    display: 'flex',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#F2F2F2',
    border: '2px dashed #828282',
    marginTop: 10,
    overflow:'elipsis'
  },
}

const onFailure = response => console.error(response);

const initialState = {
  name: '',
  img: '',
  exportData: [],
  outputData: [],
  download: false,
  fileName: 'Import excel file',
  // link: '',
  loading: false,
  check: false
};
class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = initialState;
    this.Request = new API();
    this.getCode = this.getCode.bind(this);
    this.logOut = this.logOut.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  reset() {
    this.setState(initialState);
    if (localStorage.getItem('userProfile') !== null) {
      const data = JSON.parse(localStorage.getItem('userProfile'))
      this.setState({ name: data.login, img: data.avatar_url })
   }
}

  onDrop(files) {
    this.setState({ loading: true })
    files.forEach(file => {
      this.setState({ fileName: file.name })
      if (file.name.split('.')[file.name.split('.').length - 1] === 'xlsx') {
        readXlsxFile(file).then((exportData) => {
          this.setState({ exportData })
          this.setState({ loading: false })
        })
      } else {
        this.setState({ exportData: [] })
        this.setState({ loading: false })
      }
    });
  }

  componentDidMount() {
    if (localStorage.getItem('userProfile') !== null) {
       const data = JSON.parse(localStorage.getItem('userProfile'))
       this.setState({ name: data.login, img: data.avatar_url })
    }
  }

  logOut() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userProfile')
    this.setState({ link: undefined })
    this.reset()
    this.search.reset()
  }

  async getUser() {
    try {
      const data = await this.Request.getUser()
      localStorage.setItem('userProfile', JSON.stringify(data));
      this.setState({ name: data.login, img: data.avatar_url })
    } catch (error) {
      console.log('User error', error)
    }
  }

  issue(row) {
    if (row[3] === null) {
      return {
        "title": row[1],
        "body": row[2],
      }
    }
    if (row[3].split(',').length > 1) {
      return {
        "title": row[1],
        "body": row[2],
        "assignees": 
          row[3].split(',')
        ,
      }
    }
    return {
      "title": row[1],
      "body": row[2],
      "assignees": [
        row[3]
      ],
    }
  }

  post(data) {
    this.setState({ loading: true })
    this.setState({ outputData: [...this.state.outputData, data[0]] })
    var pro = []
    for (let i = 0; i < data.length; i++) {
      if(i !== 0) {
        pro.push(this.postIssue(data[i]))
      }
    }
    Promise.all(pro).then(() => {
      this.setState({ check: true })
      setTimeout(() => {
        this.setState({ download: true }, () => this.reset())
        this.setState({ loading: false })
      }, 1200);
    });
  }

  async postIssue(row) {
    var temp = row
    const { link } = this.state;
    try {
      const data = await this.Request.postIssue(
        link,
        this.issue(row),
      )
      temp[row.length - 1] = data.number
      this.setState({ outputData: [...this.state.outputData, temp] })
    } catch (error) {
      console.log('Create issue error', error)
    }
  }

  async convertIssue() {
    try {
      const data = await this.Request.convertIssue(
          [
            {
              repo_id: 190118898,
              issue_number: 136,
              // epic_id: 91,
            }
          ]
      )
      console.log(data)
    } catch (error) {
      console.log('User error', error)
    }
  }

  async getEpic() {
    try {
      const data = await this.Request.getEpic(190118898)
      console.log(data)
    } catch (error) {
      console.log('User error', error)
    }
  }

  async getCode(response) {
    this.setState({ loading: true })
    try {
      fetch(`https://tthufo.openode.io/api/auth?code=` + response)
      .then(response => response.json())
      .then(token => localStorage.setItem('accessToken', token.token))
      .then(() => this.getUser())
      
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
      console.log('User get code', error)
    }
  }
 
  name(fileName) {
    return fileName.replace('.xlsx', '_' + new Date().toLocaleDateString())
  }

  render() {
    const { img, fileName, outputData, link, exportData, download, loading, check } = this.state;
    const isLogged = localStorage.getItem('accessToken') !== null
    const isError = fileName.split('.')[fileName.split('.').length - 1] === 'xlsx'
    return (
      <div style={{ height: '100vh',
       flex: 1,
       display: 'flex', 
       justifyContent: 'center',
       alignItems: 'center' }}>
        <Card style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          // overflow: 'auto',
          padding: 10, 
          width: isLogged ? '35%' : 360, 
          height: isLogged ?  '80%' : 360 }}>
        <div style={{ 
         display: 'flex', 
         flexDirection: 'column', 
         alignSelf: 'center',
         justifyItems: 'center',
         width: '80%',
         }}>
          <img style={{ alignSelf: 'center' }} src={logo} width='240' height='70' alt='avatar' />
          <div style={{ 
            height: '100%',
            alignSelf: 'center',
            marginTop: 20,
            marginBottom: 30,
            }}>
            { isLogged &&  <img style={{ marginRight: 15, border: '2px solid #D0E646', borderRadius: 25, overflow: 'hidden' }} src={img} width='50' height='50' alt='avatar' /> }
            <GitHubLogin 
                buttonText={isLogged ? 'Logout' : 'Sign In to Github'}
                scope="repo,user,gist"
                clientId="89e599519bea3752cf15"
                onSuccess={(response) => this.getCode(response.code)}
                onLogOut={() => this.logOut()}
                onFailure={onFailure}/>
            {/* { isLogged &&  <Label>{name}</Label> } */}
            </div>
            { isLogged &&
                <div style={{ width: '100%' }}>
                  <Search 
                  onRef={(ref) => { this.search = ref; }}
                  start={() => this.setState({ loading: true })}
                  stop={() => this.setState({ loading: false })}
                  repoLink={(link) => this.setState({ link }, () => {
                    if(link === undefined) {
                      this.reset()
                    }
                  })} />
                  { link !== undefined &&
                    <ReactDropzone
                      disableClick={false}
                      onDrop={this.onDrop} 
                      style={fileName === 'Import excel file' || isError ? styles.uploadfile : styles.uploadfile_error}
                      >
                        {smartTrim(fileName, 50)} 
                    </ReactDropzone> 
                  }
                  { exportData.length !== 0 && 
                  <Button style={{ width: '100%', marginTop: 50 }} color='success' onClick={() => this.post(exportData)}>
                    Upload Issue(s)
                  </Button> }
                  { download && <DownLoad fileName={this.name(fileName)} data={outputData} /> }
                </div>
            }
            </div>
            { loading && 
              <Load complete={check} />
            }
        </Card>
      </div>
    );
  }
}

export default Login;
