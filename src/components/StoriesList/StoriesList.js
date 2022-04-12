import { useState, useCallback } from 'react';
import ListItem from './components/ListItem/ListItem';
import Dropdown from '../Dropdown/Dropdown';
import sortBy from 'lodash/sortBy';

const filterActions = {
  default: (list) => list,
  title: (list) => sortBy(list, 'title'),
  author: (list) => sortBy(list, 'author'),
  comments: (list) => sortBy(list, 'comments'),
  points: (list) => sortBy(list, 'points').reverse(),
  num_comments: (list) => sortBy(list, 'num_comments').reverse(),
};

const StoriesList = ({ stories, onRemoveItem }) => {
  const [selectedFilter, setSelectedFilter] = useState('default');

  const handleFilterClick = (e) => {
    const { value } = e.target;
    setSelectedFilter(value);
  };

  const getSortedList = useCallback(() => {
    return filterActions[selectedFilter](stories);
  }, [stories, selectedFilter]);

  const options = Object.keys(filterActions).map((filter) => ({
    label: filter,
    value: filter,
  }));

  return (
    <>
      <Dropdown
        options={options}
        selected={selectedFilter}
        onOptionClick={handleFilterClick}
        labelby="filter"
      />
      <ul>
        {getSortedList().map((story) => {
          return (
            <ListItem
              key={story.objectID}
              item={story}
              onRemoveItem={onRemoveItem}
            />
          );
        })}
      </ul>
    </>
  );
};

export default StoriesList;
