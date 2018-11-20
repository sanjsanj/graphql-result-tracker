import React from "react";
import { adopt } from "react-adopt";
import { Query, Mutation } from "react-apollo";
import { formatDistance } from "date-fns";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "../User";
import { SINGLE_CHALLENGE_QUERY } from "../Challenge";

const DELETE_RESULT_MUTATION = gql`
  mutation DELETE_RESULT_MUTATION($id: ID!) {
    deleteResult(id: $id) {
      id
    }
  }
`;

const CONFIRM_RESULT_MUTATION = gql`
  mutation CONFIRM_RESULT_MUTATION($id: ID!) {
    confirmResult(id: $id) {
      id
    }
  }
`;

const Composed = adopt({
  currentUserQuery: ({ id, render }) => (
    <Query query={CURRENT_USER_QUERY} variables={{ id }}>
      {render}
    </Query>
  ),

  deleteResultMutation: ({ id, challengeId, render }) => (
    <Mutation
      mutation={DELETE_RESULT_MUTATION}
      variables={{ id }}
      refetchQueries={[
        { query: SINGLE_CHALLENGE_QUERY, variables: { id: challengeId } }
      ]}
    >
      {render}
    </Mutation>
  ),

  confirmResultMutation: ({ id, challengeId, render }) => (
    <Mutation
      mutation={CONFIRM_RESULT_MUTATION}
      variables={{ id }}
      refetchQueries={[
        { query: SINGLE_CHALLENGE_QUERY, variables: { id: challengeId } }
      ]}
    >
      {render}
    </Mutation>
  )
});

const UnconfirmedResult = ({ result, challengeId }) => {
  return (
    <Composed id={result.id} challengeId={challengeId}>
      {({ currentUserQuery, deleteResultMutation, confirmResultMutation }) => {
        return (
          <div>
            {result.createdBy.id === currentUserQuery.data.me.id && (
              <p>
                You{" "}
                {result.winner.id === currentUserQuery.data.me.id
                  ? "won"
                  : "lost"}{" "}
                {formatDistance(result.createdAt, new Date())} ago
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to DELETE this?")) {
                      deleteResultMutation().catch(error =>
                        alert(error.message)
                      );
                    }
                  }}
                >
                  Delete
                </button>
              </p>
            )}
            {result.createdBy.id !== currentUserQuery.data.me.id && (
              <p>
                You{" "}
                {result.winner.id === currentUserQuery.data.me.id
                  ? "won"
                  : "lost"}{" "}
                {formatDistance(result.createdAt, new Date())} ago
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to CONFIRM this?")) {
                      confirmResultMutation().catch(error =>
                        alert(error.message)
                      );
                    }
                  }}
                >
                  Confirm
                </button>
              </p>
            )}
          </div>
        );
      }}
    </Composed>
  );
};

export default UnconfirmedResult;
