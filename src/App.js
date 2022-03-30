import { useState, useReducer, useEffect } from 'react';
import StoriesList from './components/StoriesList/StoriesList';
import InputWidthLabel from './components/InputWidthLabel/InputWidthLabel';

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

const getAsyncStories = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(list), 1000);
  });


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

    getAsyncStories()
      .then((stories) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: stories,
        });
      })
      .catch((err) => {
        dispatchStories({
          type: 'STORIES_FETCH_FAILURE',
          payload: err,
        });
      });
  }, []);

  const handleOnSearch = (e) =>
    setSearchTerm(e.target.value);

  const handleRemoveStory = (storyId) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: storyId
    });
  }

  const searchedStories = stories.data.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
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
