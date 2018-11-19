import React from "react";
import { adopt } from "react-adopt";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Error from "../Error";
import CreateResult from "../CreateResult";

const SINGLE_CHALLENGE_QUERY = gql`
  query SINGLE_CHALLENGE_QUERY($id: ID!) {
    challenge(id: $id) {
      id
      title
      goal
      # results {
      #   id
      # }
      user {
        id
        name
      }
      participant {
        id
        name
      }
    }
  }
`;

const Composed = adopt({
  challengeQuery: ({ id, render }) => (
    <Query query={SINGLE_CHALLENGE_QUERY} variables={{ id }}>
      {render}
    </Query>
  )
});

const Challenge = props => (
  <Composed id={props.id}>
    {({ challengeQuery: { data, error, loading } }) => {
      if (loading) return <p>Loading...</p>;

      if (error) return <Error error={error} />;

      const { challenge } = data;

      return (
        <>
          <h2>{challenge.title}</h2>
          <p>
            <b>{challenge.user.name}</b> vs <b>{challenge.participant.name}</b>
          </p>
          <p>First to <b>{challenge.goal}</b> wins!</p>

          <CreateResult challenge={challenge} />
        </>
      );
    }}
  </Composed>
);

export default Challenge;
