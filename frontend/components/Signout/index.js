import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import { CURRENT_USER_QUERY } from "../User";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const handleConfirm = fn => {
  if (window.confirm("Are you sure you want to sign out?")) fn();

  Router.push({
    pathname: "/"
  });
};

const Signout = () => (
  <Mutation
    mutation={SIGNOUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {signout => (
      <button onClick={() => handleConfirm(signout)}>Sign out</button>
    )}
  </Mutation>
);

export default Signout;
