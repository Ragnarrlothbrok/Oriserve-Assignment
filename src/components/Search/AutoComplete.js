import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { getPhotosBySearch } from "../../actions/photoActions";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";

// render

class Autocomplete extends Component {
  //   static propTypes = {
  //     suggestions: PropTypes.instanceOf(Array),
  //   };

  //   static defaultProps = {
  //     suggestions: [],
  //   };

  constructor(props) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: "",
      data: [],
    };
  }

  async componentDidMount() {
    let data = [];
    data = JSON.parse(localStorage.getItem("History"));
    this.setState({ data: data });
  }

  onChange = (e) => {
    const { data } = this.state;
    console.log(data);

    const userInput = e.currentTarget.value;

    const filteredSuggestions = data.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput:
          filteredSuggestions[activeSuggestion] === undefined
            ? " "
            : filteredSuggestions[activeSuggestion],
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  getId = (input) => {
    for (let index in this.state.data) {
      if (this.state.data[index] === input) {
        return this.state.data[index];
      }
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
    const input = this.state.userInput;
    console.log("input" + input);
    if (input === " ") return;
    const id = this.getId(input);
    window.location = `/search/${id}`;
  };

  render() {
    const {
      onChange,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul
            className="suggestions position-absolute"
            style={{ zIndex: 1000, background: "grey" }}
          >
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class add suggestion-active
              if (index === activeSuggestion) {
                className = "";
              }

              return (
                <li
                  type="button"
                  className={className}
                  key={suggestion}
                  id="search-li"
                  onClick={() => {
                    this.setState({
                      userInput: suggestion,
                    });
                  }}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>Try any topic</em>
          </div>
        );
      }
    }

    return (
      <form>
        <TextField
          id="filled-search"
          type="search"
          onChange={onChange}
          onKeyDown={onKeyDown}
          variant="filled"
          value={this.state.userInput}
          style={{ width: "50vw", color: "black", backgroundColor: "white" }}
          className="searchbar"
          placeholder="Find your Interests"
          label="Try any topic"
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton
                  onClick={() => {
                    this.props.getPhotosBySearch(this.state.userInput);
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {suggestionsListComponent}
      </form>
    );
  }
}

Autocomplete.propTypes = {
  getPhotosBySearch: PropTypes.func.isRequired,
};

export default connect(null, { getPhotosBySearch })(Autocomplete);
