import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Search from './Search';

Enzyme.configure({ adapter: new Adapter() });

function createNodeMock(element) {
  if (element.type === 'input') {
    return {
      focus() {},
    };
  }
  return null;
}

describe('Search', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search>Search</Search>, div);
  });
  test('has a valid snapshot', () => {
    const component = renderer.create(<Search>Search</Search>, { createNodeMock });
    expect(component.toJSON()).toMatchSnapshot();
  });
  it('should focus input search', () => {
    mount(<Search>Search</Search>);
    expect(document.activeElement.outerHTML).toBe('<input type="text">');
  });
});
