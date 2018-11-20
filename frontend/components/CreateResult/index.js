import React from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import { Mutation } from "react-apollo";

import FormStyled from "../Form/styles";

import Error from "../Error";
import { SINGLE_CHALLENGE_QUERY } from "../Challenge";

const CREATE_RESULT_MUTATION = gql`
  mutation CREATE_RESULT_MUTATION(
    $challengeId: ID!
    $winnerId: ID!
    $loserId: ID!
  ) {
    createResult(
      challengeId: $challengeId
      winnerId: $winnerId
      loserId: $loserId
    ) {
      id
    }
  }
`;

class CreateResult extends React.Component {
  state = {
    winnerId: this.props.challenge.user.id,
    loserId: this.props.challenge.participant.id
  };

  handleChange = e => {
    const winnerId =
      e.target.value === "won"
        ? this.props.challenge.user.id
        : this.props.challenge.participant.id;

    const loserId =
      e.target.value === "won"
        ? this.props.challenge.participant.id
        : this.props.challenge.user.id;

    this.setState({ winnerId, loserId });
  };

  render() {
    return (
      <Mutation
        mutation={CREATE_RESULT_MUTATION}
        variables={{
          challengeId: this.props.challenge.id,
          winnerId: this.state.winnerId,
          loserId: this.state.loserId
        }}
        refetchQueries={[
          {
            query: SINGLE_CHALLENGE_QUERY,
            variables: { id: this.props.challenge.id }
          }
        ]}
      >
        {(createResult, { error, loading }) => {
          if (loading) return <p>Loading...</p>;

          if (error) return <Error error={error} />;

          return (
            <FormStyled
              method="POST"
              onSubmit={async e => {
                e.preventDefault();
                await createResult();
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Submit a result</h2>

                <label htmlFor="result-select">
                  I
                  <select id="result-select" onChange={this.handleChange}>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                  against {this.props.challenge.participant.name}
                </label>

                <button type="submit">Submit result</button>
              </fieldset>
            </FormStyled>
          );
        }}
      </Mutation>
    );
  }
}

export default CreateResult;
