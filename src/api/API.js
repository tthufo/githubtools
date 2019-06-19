import BaseRepository from './BaseRepository';

class LoginApi extends BaseRepository {
  constructor() {
    super();
    this.PATH = '';
  }

  getUser() {
    return this.get(`${this.PATH}/user`);
  }

  getProject() {
    return this.get(`${this.PATH}/user/repos?page=4`);
  }

  getUserRepo() {
    return this.get(`${this.PATH}/users/tthufo/repos`);
  }

  getOrg() {
    return this.get(`${this.PATH}/repos/Innovatube/profinanss-production-react/assignees`);
  }

  postIssue(link, params) {
    return this.post(`${this.PATH}/repos/${link}/issues`, params);
  }

  convertIssue(params) {
    return this.postZ(`${this.PATH}/p1/repositories/${params[0].repo_id}/issues/${params[0].issue_number}/convert_to_epic`, { issues: params });
  }

  getEpic(param) {
    return this.getZ(`${this.PATH}/p1/repositories/${param}/epics`);
  }

  search(param) {
    return this.get(`${this.PATH}/search/repositories`, param);
  }


  getToken(param) {
    return this.postT('https://github.com/login/oauth/access_token', param)
  }

}

export default LoginApi;
