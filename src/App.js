import {
  useState,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import StoriesList from './components/StoriesList/StoriesList';
import SearchForm from './components/SearchForm/SearchForm';
import { debounce } from 'lodash';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search';
const getUrl = (searchTerm, page) =>
  `${`${API_ENDPOINT}?query=${searchTerm}&page=${page}`}`;

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
        page: action.payload.page,
        data: [...state.data, ...action.payload.data],
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
          (story) => action.payload !== story.objectID
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
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    ''
  );

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    page: 0,
    isLoading: false,
    error: false,
  });

  const [url, setUrl] = useState(getUrl(searchTerm, 0));

  const handleFetchStories = useCallback(() => {
    dispatchStories({
      type: 'STORIES_FETCH_INIT',
      payload: true,
    });

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: {
            data: data.hits,
            page: data.page + 1,
          },
        });
      })
      .catch((err) => {
        dispatchStories({
          type: 'STORIES_FETCH_FAILURE',
          payload: err,
        });
      });
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const loadMoreRef = useRef();

  useEffect(() => {
    const handleOnScroll = debounce(() => {
      if (stories.isLoading) return;
      const { top, height } =
        loadMoreRef.current.getBoundingClientRect();

      if (top - height > 0 && top + height <= window.innerHeight) {
        setUrl(getUrl(searchTerm, stories.page));
      }
    }, 150);
    window.addEventListener('scroll', handleOnScroll);

    return () => window.removeEventListener('scroll', handleOnScroll);
  }, [searchTerm, stories]);

  const handleOnSearch = (e) => setSearchTerm(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setUrl(getUrl(searchTerm, 0));
  };

  const handleRemoveStory = (storyId) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: storyId,
    });
  };

  return (
    <div>
      {stories.error && <span>{stories.error?.message}</span>}
      <header>
        <h1>Hacker news stories</h1>
        {searchTerm && (
          <p>
            Searching for <strong>{searchTerm}</strong>.
          </p>
        )}

        <SearchForm
          onSearchInput={handleOnSearch}
          onSearchSubmit={handleSearchSubmit}
          searchTerm={searchTerm}
        />
      </header>

      <hr />

      {stories.isLoading && <span>...Loading</span>}

      {!!stories.data?.length && (
        <StoriesList
          stories={stories.data}
          onRemoveItem={handleRemoveStory}
        />
      )}
      <div ref={loadMoreRef}>Load more..</div>
    </div>
  );
};

export default App;
