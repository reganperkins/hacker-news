import React from 'react';
import renderer from 'react-test-renderer';

import SearchForm from './SearchForm';
import InputWidthLabel from '../InputWidthLabel/InputWidthLabel';

describe('SearchForm', () => {
  const searchFormProps = {
    searchTerm: 'React',
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };

  let component;

  beforeEach(() => {
    component = renderer.create(<SearchForm {...searchFormProps} />);
  });

  it('renders the input field with its value', async () => {
    const inputWithLabel = await component.root.findByType(
      InputWidthLabel
    );
    const value = inputWithLabel.props.value;

    expect(value).toEqual('React');
  });

  it('changes the input field', async () => {
    const pseudoEvent = { target: 'Redux' };
    const searchInput = await component.root.findByType('input');

    searchInput.props.onChange(pseudoEvent);

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchInput).toHaveBeenCalledWith(
      pseudoEvent
    );
  });

  it('submits the form', async () => {
    const pseudoEvent = {};
    const form = await component.root.findByType('form');

    form.props.onSubmit(pseudoEvent);

    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledWith(
      pseudoEvent
    );
  });

  it('disables the button and prevents submit', async () => {
    component.update(
      <SearchForm {...searchFormProps} searchTerm="" />
    );
    const button = await component.root.findByType('button');

    expect(button.props.disabled).toBeTruthy();
  });
});
