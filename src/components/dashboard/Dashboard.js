import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Photos from "../photos/Photos";
import { ToastContainer, toast } from "react-toastify";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import "react-toastify/dist/ReactToastify.css";
import { getPhotos } from "../../actions/photoActions";
import ImageList from "../Search/SearchList";
import ImageModal from "../Search/SearchModal";
import {
  scrollAreaAvailable,
  debounce,
  throttle,
  checkHttpStatus,
  parseJSON,
} from "../utilities/utilities";
import apiCalls from "../../apiCalls";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../common/Spinner";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    const queriesFromStorage = JSON.parse(
      localStorage.getItem(apiCalls.STORAGE_KEY)
    );
    this.state = {
      searchText: "",
      imageList: [],
      imageList2: [],
      pageNumber: 1,
      showModal: false,
      modalImage: null,
      page: 1,
      queries: queriesFromStorage ? queriesFromStorage : [],
    };
    // Function bindings
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleImageClick2 = this.handleImageClick2.bind(this);
    this.onModalHide = this.onModalHide.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScroll1 = this.handleScroll1.bind(this);
  }
  componentDidMount() {
    //for getting normal feed
    this.props.getPhotos(this.state.page);

    //search optimization to minimize API calls
    this.makeDebouncedSearch = debounce(() => {
      /* Save search query */
      this.state.queries.push(this.state.searchText);
      this.setState({ queries: this.state.queries }, this.updateLocalStorage());

      /* Make API call for the query */
      const url = apiCalls.BASE_URL + "&text=" + this.state.searchText;
      fetch(url)
        .then(checkHttpStatus)
        .then(parseJSON)
        .then((resp) => {
          this.setState({ imageList: resp.photos.photo });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);

    //simple photos
    let url =
      "https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=82ef54fdfcec0156b522a6113b807e3e&format=json&nojsoncallback=1&page=" +
      this.state.page;
    fetch(url)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then((resp) => {
        this.setState({ imageList2: resp.photos.photo });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  updateLocalStorage() {
    localStorage.setItem(
      apiCalls.STORAGE_KEY,
      JSON.stringify(this.state.queries)
    );
  }

  onSearchInputChange(e) {
    const searchText = e.currentTarget.value;
    this.setState({ searchText });
    const slim = searchText.replace(/\s+$/, "");
    if (slim.length) this.makeDebouncedSearch(slim);
  }

  handleScroll() {
    let url =
      apiCalls.BASE_URL +
      "&text=" +
      this.state.searchText +
      "&page=" +
      (this.state.pageNumber + 1);
    fetch(url)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then((resp) => {
        resp.photos.photo.forEach((photo) => this.state.imageList.push(photo));
        this.setState({
          pageNumber: resp.photos.page,
          imageList: this.state.imageList,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  handleScroll1() {
    let url =
      "https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=82ef54fdfcec0156b522a6113b807e3e&format=json&nojsoncallback=1&page=" +
      (this.state.page + 1);
    fetch(url)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then((resp) => {
        resp.photos.photo.forEach((photo) => this.state.imageList2.push(photo));
        this.setState({
          pageNumber: resp.photos.page,
          imageList2: this.state.imageList2,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleImageClick(idx) {
    this.setState({ modalImage: this.state.imageList[idx] });
  }

  handleImageClick2(idx) {
    console.log(this.state.imageList2[idx]);
    this.setState({ modalImage: this.state.imageList2[idx] });
  }

  onModalHide() {
    this.setState({ modalImage: null });
  }

  render() {
    // const { photos, loading } = this.props.photo;

    return (
      <div className="dashboard">
        <ToastContainer />
        <div className="app-header">
          <h5 className="heading1 mb-2" style={{ marginBottom: "5px" }}>
            OriServe Assignment
          </h5>
          <div className="h-flex jc ac search-bar">
            <input
              type="text"
              className="search-input"
              value={this.state.searchText}
              onChange={this.onSearchInputChange}
            />
          </div>
          {this.state.queries.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <h5 className="heading2" style={{ marginBottom: "5px" }}>
                Recent Searches
              </h5>
              <ul className="h-flex jc">
                {this.state.queries.map((query, idx) => (
                  <li key={idx} className="query">
                    {query}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="app-content" ref="appContent">
          <InfiniteScroll
            dataLength={this.state.imageList.length}
            next={this.handleScroll}
            hasMore={true}
            loader={Spinner}
          >
            {this.state.imageList.length ? (
              <ImageList
                images={this.state.imageList}
                onImageClick={this.handleImageClick}
              />
            ) : (
              ""
            )}
            <ReactCSSTransitionGroup
              transitionName="modal-container"
              transitionEnterTimeout={400}
              transitionLeaveTimeout={200}
            >
              {this.state.modalImage && (
                <ImageModal
                  image={this.state.modalImage}
                  onHide={this.onModalHide}
                />
              )}
            </ReactCSSTransitionGroup>
          </InfiniteScroll>
          <InfiniteScroll
            dataLength={this.state.imageList2.length}
            next={this.handleScroll1}
            hasMore={true}
            loader={Spinner}
          >
            {this.state.imageList.length ? (
              ""
            ) : (
              <ImageList
                images={this.state.imageList2}
                onImageClick={this.handleImageClick2}
              />
              // <div className="container-fluid" style={{ width: "90%" }}>
              //   <Photos photos={photos} loading={loading} />
              // </div>
            )}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getPhotos: PropTypes.func.isRequired,
  photo: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  photo: state.photo,
});

export default connect(mapStateToProps, { getPhotos })(Dashboard);
