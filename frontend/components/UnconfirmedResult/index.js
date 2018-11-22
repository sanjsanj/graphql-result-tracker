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
        const deleteOrConfirm =
          result.createdBy.id === currentUserQuery.data.me.id
            ? "Delete"
            : "Confirm";

        const deleteOrConfirmFunc =
          result.createdBy.id === currentUserQuery.data.me.id
            ? deleteResultMutation
            : confirmResultMutation;

        const wonOrLost =
          result.winner.id === currentUserQuery.data.me.id ? "won" : "lost";

        return (
          <p>
            You {wonOrLost} {formatDistance(result.createdAt, new Date())} ago
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    `Are you sure you want to ${deleteOrConfirm.toUpperCase()} this?`
                  )
                ) {
                  deleteOrConfirmFunc().catch(error => alert(error.message));
                }
              }}
            >
              {deleteOrConfirm}
            </button>
          </p>
        );
      }}
    </Composed>
  );
};

export default UnconfirmedResult;
