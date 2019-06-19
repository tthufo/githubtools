import MetaInfoHelper from './MetaInfoHelper';

class BaseRepository {
  constructor() {
    this.BASE_URL = `${'https://api.github.com' || ''}`;
    this.BASE_ZEN_URL = `${'https://api.zenhub.io' || ''}`;
    this.PATH = '/';
  }

  index(offset, limit, order, direction, searchWord = '', params = {}) {
    return this.get(this.PATH, Object.assign({
      offset: offset || 0,
      limit: limit || 0,
      direction: direction || 'asc',
      order: order || 'id',
      query: searchWord || '',
    }, params));
  }

  show(id, params = {}) {
    return this.get(`${this.PATH}/${id}`, params);
  }

  store(params = {}) {
    return this.post(this.PATH, params);
  }

  update(id, params = {}) {
    return this.put(`${this.PATH}/${id}`, params);
  }

  destroy(id, params = {}) {
    return this.delete(`${this.PATH}/${id}`, params);
  }

  get(url, params = {}) {
    return this.request('GET', url, params);
  }

  getZ(url, params = {}) {
    return this.requestZ('GET', url, params);
  }

  getWithURL(url) {
    return this.requestGetUrl(url);
  }

  putWithURL(url) {
    return this.requestPutUrl(url);
  }

  post(url, params = {}) {
    return this.request('POST', url, params);
  }

  postZ(url, params = {}) {
    return this.requestZ('POST', url, params);
  }

  put(url, params = {}) {
    params._method = 'put'; //eslint-disable-line
    return this.request('PUT', url, params);
  }

  delete(url, params = {}) {
    params._method = 'delete'; //eslint-disable-line
    return this.request('POST', url, params);
  }

  requestGetUrl(url) {
    const accessToken = localStorage.getItem('accessToken');
    const realUrl = this.BASE_URL + url;
    const method = 'GET';

    return fetch(realUrl, { headers: { "Content-Type": "application/json", Authorization: `bearer ${accessToken}` }, credentials: 'same-origin', method })
      .then(response => response.json()).catch(error => console.log('Error', error));
  }

  requestPutUrl(url) {
    const accessToken = localStorage.getItem('accessToken');
    const realUrl = this.BASE_URL + url;
    const method = 'PUT';

    return fetch(realUrl, { headers: {  "Content-Type": "application/json", Authorization: `bearer ${accessToken}` }, credentials: 'same-origin', method })
      .then(response => response.json()).catch(error => console.log('Error', error));
  }

  request(method, url, params = {}) {
    const accessToken = localStorage.getItem('accessToken');

    let realUrl = this.BASE_URL + url;
    if (method === 'GET' || method === 'HEAD') {
      const query = Object.keys(params)
        .map(k => `${k}=${params[k]}`)
        .join('&');
      realUrl = `${realUrl}?${query}`;

      return fetch(realUrl, { headers: { 'User-Agent': '*', "Content-Type": "application/json; charset=UTF-8", Authorization: `bearer ${accessToken}` }, credentials: 'same-origin', method })
        .then(response => response.json()).catch(error => console.log('Error', error));
    }

    return fetch(realUrl, {
      credentials: 'same-origin', headers: { 'User-Agent': '*', "Content-Type": "application/json; charset=UTF-8", Authorization: `bearer ${accessToken}` }, method, body: JSON.stringify(params),
    })
      .then(response => response.json()).catch(error => error);
  }

  requestZ(method, url, params = {}) {
    const accessToken = 'c94ce7fceff9f41d787c3e6e131d8d84653d7ab3ff1b14803873697e0d0640548a30312df4250fc5';

    let realUrl = this.BASE_ZEN_URL + url;
    if (method === 'GET' || method === 'HEAD') {
      const query = Object.keys(params)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&');
      realUrl = `${realUrl}?${query}`;

      return fetch(realUrl, { headers: { 'User-Agent': '*', "Content-Type": "application/json; charset=UTF-8", 'X-Authentication-Token': `${accessToken}` }, credentials: 'same-origin', method })
        .then(response => response.json()).catch(error => console.log('Error', error));
    }

    return fetch(realUrl, {
      credentials: 'same-origin', headers: { 'User-Agent': '*', "Content-Type": "application/json; charset=UTF-8", 'X-Authentication-Token': `${accessToken}` }, method, body: JSON.stringify(params),
    })
      .then(response => response.json()).catch(error => error);
  }
}

export default BaseRepository;
