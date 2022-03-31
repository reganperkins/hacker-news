const ListItem = ({ item, onRemoveItem }) => {
  return (
    <li>
      <a href={item.url}>{item.title}</a>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <button
        type="button"
        onClick={() => onRemoveItem(item.objectID)}
      >
        Dismiss
      </button>
    </li>
  );
};

export default ListItem;
