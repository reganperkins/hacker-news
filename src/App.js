import { useState, useReducer, useEffect } from 'react';
import StoriesList from './components/StoriesList/StoriesList';
import InputWidthLabel from './components/InputWidthLabel/InputWidthLabel';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error(`unhandled type ${action.type}`);
  }
};

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};


const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading: false, error: false }
  );

  useEffect(() => {
    dispatchStories({
      type: 'STORIES_FETCH_INIT',
      payload: true,
    });

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then(response => response.json())
      .then((data) => {
        dispatchStories({type: 'STORIES_FETCH_SUCCESS', payload: data.hits});
      })
      .catch((err) => {
        dispatchStories({type: 'STORIES_FETCH_FAILURE', payload: err});
      });
  }, [searchTerm]);

  const handleOnSearch = (e) =>
    setSearchTerm(e.target.value);

  const handleRemoveStory = (storyId) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: storyId
    });
  }

  const searchedStories = stories.data.filter(story =>
    story.title && story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      { stories.error
        && <span>{stories.error?.message}</span> }
      <header>
        <h1>Hacker news stories</h1>
        {searchTerm
          && <p>Searching for <strong>{searchTerm}</strong>.</p>
        }

        <InputWidthLabel
          id="search"
          isFocused
          onInputChange={handleOnSearch}
          value={searchTerm}
        >Search:</InputWidthLabel>
      </header>

      <hr />

      { stories.isLoading
        ? <span>...Loading</span>
        : <StoriesList
          stories={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
      }

    </div>
  );
}

export default App;
