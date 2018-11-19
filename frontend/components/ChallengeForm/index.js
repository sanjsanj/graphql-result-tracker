import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import styled from "styled-components";

import FormStyled from "../Form/styles";

import Error from "../Error";

const CREATE_CHALLENGE_MUTATION = gql`
  mutation CREATE_CHALLENGE_MUTATION(
    $title: String!
    $goal: Int!
    $participantEmail: String!
  ) {
    createChallenge(
      title: $title
      goal: $goal
      participantEmail: $participantEmail
    ) {
      id
    }
  }
`;

const InputSpanStyled = styled.input`
  display: inline-block;
  width: 50px !important;
  margin: 0 10px;
`;

class ChallengeForm extends Component {
  state = {
    participantEmail: "",
    title: "",
    goal: 3
  };

  saveToState = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <Mutation mutation={CREATE_CHALLENGE_MUTATION} variables={this.state}>
        {(createChallenge, { error, loading }) => {
          if (loading) return <p>Loading...</p>;

          return (
            <FormStyled
              method="POST"
              onSubmit={async e => {
                e.preventDefault();

                const res = await createChallenge();

                this.setState({
                  participantEmail: "",
                  title: "",
                  goal: 3
                });
                console.log(res.data);

                // Router.push({
                //   pathname: "/challenge",
                //   query: { id: res.data.createChallenge.id }
                // });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Challenge a friend</h2>

                <Error error={error} />

                <label htmlFor="participantEmail">
                  Friend's Email
                  <input
                    type="email"
                    name="participantEmail"
                    value={this.state.participantEmail}
                    onChange={this.saveToState}
                  />
                </label>

                <label htmlFor="title">
                  I challenge you to a game of
                  <input
                    type="title"
                    name="title"
                    value={this.state.title}
                    onChange={this.saveToState}
                  />
                </label>

                <label htmlFor="goal">
                  Winner is the first to
                  <InputSpanStyled
                    type="number"
                    name="goal"
                    value={this.state.goal}
                    onChange={this.saveToState}
                  />
                  wins
                </label>

                <button type="submit">Challenge</button>
              </fieldset>
            </FormStyled>
          );
        }}
      </Mutation>
    );
  }
}

export default ChallengeForm;
