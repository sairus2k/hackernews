import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import cn from 'classnames';
import Button from './Button';

const style = {
  largeColumn: { width: '40%' },
  modColumn: { width: '30%' },
  smallColumn: { width: '10%' },
};

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const Sort = ({ sortKey, activeSortKey, isSortedReverse, onSort, children }) => {
  const isActive = activeSortKey === sortKey;
  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={cn('button-inline', {'button-active': isActive })}
    >
      {children}
      {isActive && <i className={cn('fa', {
        'fa-angle-down' : !isSortedReverse,
        'fa-angle-up': isSortedReverse,
      })} />}
    </Button>
  )
};

class Table extends React.Component {
  state = {
    sortKey: 'NONE',
    isSortReverse: false,
  };
  onSort = sortKey => {
    this.setState(state => ({ sortKey, isSortReverse: state.sortKey === sortKey && !state.isSortReverse }));
  };
  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className="table">
        <div className="table-header">
          <span style={style.largeColumn}><Sort sortKey="TITLE" activeSortKey={sortKey} onSort={this.onSort} isSortedReverse={isSortReverse}>Title</Sort></span>
          <span style={style.modColumn}><Sort sortKey="AUTHOR" activeSortKey={sortKey} onSort={this.onSort} isSortedReverse={isSortReverse}>Author</Sort></span>
          <span style={style.smallColumn}><Sort sortKey="COMMENTS" activeSortKey={sortKey} onSort={this.onSort} isSortedReverse={isSortReverse}>Comments</Sort></span>
          <span style={style.smallColumn}><Sort sortKey="POINTS" activeSortKey={sortKey} onSort={this.onSort} isSortedReverse={isSortReverse}>Points</Sort></span>
          <span style={style.smallColumn}>Archive</span>
        </div>
        {reverseSortedList.map(item => (
            <div key={item.objectID} className="table-row">
        <span style={style.largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
              <span style={style.modColumn}>{item.author}</span>
              <span style={style.smallColumn}>{item.num_comments}</span>
              <span style={style.smallColumn}>{item.points}</span>
              <span style={style.smallColumn}>
        <Button onClick={() => { onDismiss(item.objectID); }} className="button-inline">Dismiss</Button>
      </span>
            </div>
          )
        )}
      </div>
    )
  }
}

Table.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    objectID: PropTypes.string.isRequired,
    url: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    num_comments: PropTypes.number,
    points: PropTypes.number,
  })).isRequired,
  onDismiss: PropTypes.func,
};

export default Table;
