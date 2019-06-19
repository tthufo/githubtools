import React, { Component } from 'react';
import {
  Input,
} from 'reactstrap';
import Select from 'react-select';
import API from '../api/API'

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
       repos: [],
       selectedRepo: '',
    };
    this.Request = new API();
    this.timeout =  0;
    this.reset = this.reset.bind(this);
}

componentDidMount() {
  const { onRef } = this.props;
  if (onRef) {
    onRef(this, this.reset);
  }
}

reset() {
  this.setState({ repos: [],
    selectedRepo: '', });
}

searchRepo(evt){
  var searchText = evt.target.value; 
  const { repoLink, start } = this.props;
  if(this.timeout) clearTimeout(this.timeout);
  this.timeout = setTimeout(() => {
    if (searchText !== '') {
      start()
      this.getRepo(searchText)
    } else {
      this.setState({ repos: [] }, () => repoLink(undefined))
    }
  }, 700);
}

async getRepo(repo) {
  const { repoLink, stop } = this.props;
    try {
        const { repos } = this.state;
        const data = await this.Request.search({q: `${repo}+user:innovatube` })
        const rep = data.items.map(item => ({ ...repos, value: item.id, label: item.name, fullname: item.full_name }));
        this.setState({ repos: rep }, () => stop())
    } catch (error) {
        this.setState({ repos: [] }, () => repoLink(undefined))
        stop()
        console.log('Repo error', error)
    }
}

  render() {
    const { repos, selectedRepo } = this.state;
    const { repoLink } = this.props;
    return (
      <div>
         <Input onChange={(e) => this.searchRepo(e)} style={{ width: '100%', marginBottom: 10 }} placeholder="Search for Repo" />
         {repos.length !== 0 &&
          <Select
              options={repos}
              value={selectedRepo}
              onChange={value => this.setState({ selectedRepo: value.name }, () => repoLink(value.fullname))}
              placeholder="Pick one"
            />
         }
      </div>
    );
  }
}

export default Search;