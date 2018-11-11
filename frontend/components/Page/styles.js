import styled, { injectGlobal } from "styled-components";

const theme = {
  colour: "black",
  colourSecondary: "#f97627",
  colourTertiary: "#3aa1ec",
  backgroundColour: "white",
  // colour: "white",
  // colourSecondary: "#f97627",
  // colourTertiary: "#3aa1ec",
  // backgroundColour: "#525252",
  maxWidth: "1000px",
  bs: "0 12px 24px 0 rgba(0, 0, 0, 0.09)"
};

const StyledPage = styled.div`
  color: ${theme.colour};
  background-color: ${theme.backgroundColour};
`;

const Inner = styled.div`
  max-width: ${theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

injectGlobal`
  html {
    box-sizing: border-box;
    font-size: 10px;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: Helvetica, sans-serif;
  }

  a {
    text-decoration: none;
    color: ${theme.colourSecondary};
  }

  button {
    font-family: Helvetica, sans-serif;
  }
`;

export { theme, StyledPage, Inner };
