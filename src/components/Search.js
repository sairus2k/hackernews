import React from 'react';
import PropTypes from 'prop-types';

export default class Search extends React.Component {
  static propTyeps = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };
  componentDidMount() {
    this.input.focus();
  }
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input type="text" onChange={onChange} value={value} ref={(node) => { this.input = node; }} />
        <button type="submit">{children}</button>
      </form>
    )
  }
}
