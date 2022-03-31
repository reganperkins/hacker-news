import React from 'react';
import renderer from 'react-test-renderer';

import ListItem from './ListItem';

describe('ListItem', () => {
  const story = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 432,
  };

  let component;
  const handleRemoveItem = jest.fn();
  beforeEach(() => {
    component = renderer.create(
      <ListItem item={story} onRemoveItem={handleRemoveItem} />
    );
  });

  it('renders all properties', async () => {
    const storyLink = await component.root.findByType('a');
    expect(storyLink.props.href).toEqual('https://reactjs.org/');

    const author = await component.root.findAllByProps({
      children: 'Jordan Walke',
    });
    expect(author.length).toEqual(1);
  });

  it('calls onRemoveItem on button click', async () => {
    const button = await component.root.findByType('button');
    button.props.onClick();

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(story.objectID);

    const item = await component.root.findAllByType(ListItem);
    expect(item.length).toEqual(1);
  });
});
