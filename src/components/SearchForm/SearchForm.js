import InputWidthLabel from '../InputWidthLabel/InputWidthLabel';

const SearchForm = ({onSearchInput, searchTerm, onSearchSubmit}) => {
  return(
    <form onSubmit={onSearchSubmit}>
      <InputWidthLabel
        id="search"
        isFocused
        onInputChange={onSearchInput}
        value={searchTerm}
      >
        Search:
      </InputWidthLabel>
      <button
        type="submit"
        disabled={!searchTerm}
      >
        Submit
      </button>
    </form>
  );
};

export default SearchForm;