import React from "react";
import { adopt } from "react-adopt";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { BadgeStyled } from "./styles";
import FormStyled from "../Form/styles";

import Error from "../Error";
import CreateResult from "../CreateResult";
import UnconfirmedResult from "../UnconfirmedResult";

const SINGLE_CHALLENGE_QUERY = gql`
  query SINGLE_CHALLENGE_QUERY($id: ID!) {
    challenge(id: $id) {
      id
      title
      goal
      results {
        id
        confirmed
        createdAt
        createdBy {
          id
        }
        winner {
          id
        }
      }
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

      const unconfirmedResults = challenge.results.filter(
        result => !result.confirmed
      );

      const confirmedResults = challenge.results.filter(
        result => result.confirmed
      );

      const userWins = confirmedResults.filter(
        result => result.winner.id === challenge.user.id
      );

      const participantWins = confirmedResults.filter(
        result => result.winner.id === challenge.participant.id
      );

      const challengeComplete =
        userWins.length >= challenge.goal ||
        participantWins.length >= challenge.goal;

      const winner =
        userWins > participantWins
          ? challenge.user.name
          : challenge.participant.name;

      return (
        <>
          <FormStyled>
            <h2>{challenge.title}</h2>
            <p>
              <b>{challenge.user.name}</b> vs{" "}
              <b>{challenge.participant.name}</b>
            </p>
            <p>
              First to <b>{challenge.goal}</b> wins!
            </p>
          </FormStyled>

          <FormStyled>
            <h3>Score:</h3>
            <p>
              {challenge.user.name} <BadgeStyled>{userWins.length}</BadgeStyled>{" "}
              vs <BadgeStyled>{participantWins.length}</BadgeStyled>{" "}
              {challenge.participant.name}
            </p>
          </FormStyled>

          <FormStyled>
            <h3>Unconfirmed results</h3>
            {unconfirmedResults.map(result => (
              <UnconfirmedResult
                key={result.id}
                result={result}
                challengeId={props.id}
              />
            ))}
          </FormStyled>

          {challengeComplete && <FormStyled>{winner} won!</FormStyled>}

          {!challengeComplete && <CreateResult challenge={challenge} />}
        </>
      );
    }}
  </Composed>
);

export default Challenge;
export { SINGLE_CHALLENGE_QUERY };
