import React from 'react';
import renderer from 'react-test-renderer';

import StoriesList from './StoriesList';
import ListItem from './components/ListItem/ListItem';

describe('StoriesList', () => {
  const list = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  it('renders two items', () => {
    const component = renderer.create(<StoriesList stories={list} />);

    expect(component.root.findAllByType(ListItem).length).toEqual(2);
  });
});
