import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Button from './Button';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Button', () => {
  const props = {
    onClick() {},
  };
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button {...props}>Button</Button>, div);
  });
  test('has a valid snapshot', () => {
    const component = renderer.create(<Button {...props}>Button</Button>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should render button with "Search" text', () => {
    expect(shallow(<Button {...props}>Search</Button>).text()).toBe('Search');
  });
});
