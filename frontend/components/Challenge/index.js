import React from "react";
import { adopt } from "react-adopt";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Error from "../Error";

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
        # id
        name
        # email
      }
      participant {
        # id
        name
        # email
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
            {challenge.user.name} vs {challenge.participant.name}
          </p>
          <p>First to {challenge.goal} wins!</p>
        </>
      );
    }}
  </Composed>
);

// class Challenge extends React.Component {
//   render() {
//     return (
//       <Composed id={this.props.id}>
//         <h2>Challenge {this.props.id}</h2>
//       </Composed>
//     );
//   }
// }

export default Challenge;
