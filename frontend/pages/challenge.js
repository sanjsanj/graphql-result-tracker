import React from "react";
import styled from "styled-components";

import Challenge from "../components/Challenge";
import ChallengeForm from "../components/ChallengeForm";

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const ChallengePage = props => {
  if (props.query && props.query.id) {
    return (
      <Columns>
        <Challenge id={props.query.id} />
      </Columns>
    );
  }

  return (
    <Columns>
      <ChallengeForm />
    </Columns>
  );
};

export default ChallengePage;
