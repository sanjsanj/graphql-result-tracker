import React, { Component } from "react";

import Meta from "../Meta";
import Header from "../Header";
import Footer from "../Footer";

class Page extends Component {
  render() {
    return (
      <>
        <Meta />
        <Header />
        {this.props.children}
        <Footer />
      </>
    );
  }
}

export default Page;
