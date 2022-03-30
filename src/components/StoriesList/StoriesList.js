import ListItem from './components/ListItem/ListItem';

const StoriesList = ({ stories, onRemoveItem }) => {
  return (
    <ul>
      {stories.map(story => {
          return <ListItem key={story.objectID} item={story} onRemoveItem={onRemoveItem} />;
        })
      }
    </ul>
  );
}

export default StoriesList;