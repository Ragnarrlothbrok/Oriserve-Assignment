import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <div className="navbar-brand" style={{ color: "white" }}>
            Flicker Search
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <Link className="lead ml-auto mt-auto" style={{ color: "white" }}>
              Assignment
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
