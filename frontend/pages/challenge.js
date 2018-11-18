import React from "react";
import styled from "styled-components";

import Challenge from "../components/Challenge";

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const ChallengePage = () => {
  return (
    <Columns>
      <Challenge />
    </Columns>
  );
};

export default ChallengePage;
