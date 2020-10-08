import React, { Component } from "react";
import PropTypes from "prop-types";

class Modal extends Component {
  render() {
    return (
      <div
        className="Modal"
        style={{
          transform: this.props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: this.props.show ? "1" : "0",
          display: this.props.show ? "" : "none",
        }}
      >
        <img src={this.props.url} alt="Sorry Something went wrong" />
      </div>
    );
  }
}

Modal.propTypes = {
  url: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  // auth: state.auth,
  // errors: state.errors,
  // campaign: state.campaign,
});

export default Modal;
