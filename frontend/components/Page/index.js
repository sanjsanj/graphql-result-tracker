import React, { Component } from "react";
import { ThemeProvider } from "styled-components";

import { theme, StyledPage, Inner } from "./styles";

import HeadMeta from "../HeadMeta";
import Header from "../Header";
import Footer from "../Footer";

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <HeadMeta />
          <Header />
          <Inner>{this.props.children}</Inner>
          <Footer />
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export default Page;
