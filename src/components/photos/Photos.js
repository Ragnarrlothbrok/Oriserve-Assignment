import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import { getPhotos } from "../../actions/photoActions";
import PhotoItem from "./PhotoItem";

import "react-toastify/dist/ReactToastify.css";

import ImageModal from "../Search/SearchModal";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

class Photos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      modalImage: null,
    };
    // Function bindings

    this.handleImageClick = this.handleImageClick.bind(this);
    this.onModalHide = this.onModalHide.bind(this);
  }

  handleImageClick(idx) {
    this.setState({ modalImage: idx });
  }

  onModalHide() {
    this.setState({ modalImage: null });
  }
  render() {
    const photos = this.props.photos;
    const loading = this.props.loading;

    if (!photos) {
      return null;
    }

    let photoItems;
    if (photos === null || loading) {
      photoItems = <Spinner />;
    } else {
      if (photos.photo.length > 0) {
        photoItems = photos.photo.map((photo) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            onImageClick={this.handleImageClick}
          />
        ));
      } else {
        photoItems = <h4>No photos found...</h4>;
      }
    }

    return (
      <div className="photos ">
        <div className="row">{photoItems}</div>
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
      </div>
    );
  }
}
Photos.propTypes = {
  getPhotos: PropTypes.func.isRequired,
  photo: PropTypes.object.isRequired,
  photos: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  photo: state.photo,
});

export default connect(mapStateToProps, { getPhotos })(Photos);
