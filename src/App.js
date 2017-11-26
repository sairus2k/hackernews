import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import './App.css';
import Search from './components/Search';
import Table from './components/Table';
import Button from './components/Button';
import Loading from './components/Loading';
import { DEFAULT_HPP, PARAM_HPP, PARAM_PAGE, DEFAULT_QUERY, PARAM_SEARCH, PATH_SEARCH, PATH_BASE } from './constants';
import { withEither } from './helpers/hocs';

const updateSearchTopStoriesState = result => ({ searchKey, results }) => {
  const { hits, page } = result;
  const oldResults = results[searchKey] ? results[searchKey] : {};
  const updatedHits = [...oldResults.hits || [], ...hits];
  return {
    results: {
      ...results,
      [searchKey]: { ...result, hits: updatedHits, page },
    },
    isLoading: false,
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: {},
      searchTerm: DEFAULT_QUERY,
      searchKey: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };
  }
  componentDidMount() {
    const { searchKey } = this.state;
    window.addEventListener('fetch', (e) => {
      console.log(e);
    });
    this.fetchSearchTopStories(searchKey).then();
  }
  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];
  setSearchTopStories = result => {
    this.setState(updateSearchTopStoriesState(result));
  };
  fetchSearchTopStories = async (searchKey, page = 0) => {
    this.setState({ isLoading: true });
    try {
      const query = `${PARAM_SEARCH}${searchKey}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
      const response = await fetch(`${PATH_BASE}${PATH_SEARCH}?${query}`);
      const result = await response.json();
      this.setSearchTopStories(result);
    } catch (error) {
      this.setState({ error });
    }
  };
  onDismiss = id => {
    this.setState(state => {
      const { searchKey, results } = state;
      const { hits, page } = results[searchKey];
      const isNotId = item => item.objectID !== id;
      const updatedHits = hits.filter(isNotId);
      return {
        results: {
          ...state.results,
          [searchKey]: { ...results[searchKey], hits: updatedHits, page }
        },
      }
    });
  };
  onSearchChange = e => {
    this.setState({ searchTerm: e.target.value.toLowerCase() });
  };
  onSearchSubmit = e => {
    e.preventDefault();
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm).then();
    }
  };
  render() {
    const { results, searchTerm, searchKey, error, isLoading } = this.state;
    const result = results[searchKey];
    const page = (result && result.page) || 0;
    const list = (result && result.hits) || [];
    const ButtonWithLoading = withEither(isLoading, Loading)(Button);
    const TableError = (
      <div className="interactions">
        <p>Something went wrong</p>
      </div>
    );
    const TableWithError = withEither(error, TableError)(Table);
    return (
      <div className="page">
        <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Search</Search>
        <TableWithError list={list} onDismiss={this.onDismiss} />
        <div className="interactions">
          <ButtonWithLoading onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;
