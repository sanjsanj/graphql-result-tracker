import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import FormStyled from "../Form/styles";

import Error from "../Error";
import { CURRENT_USER_QUERY } from "../User";
import { ALL_USER_CHALLENGES_QUERY } from "../../pages";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      name
      email
    }
  }
`;

class Signup extends Component {
  state = {
    name: "",
    password: "",
    email: ""
  };

  saveToState = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY },
          { query: ALL_USER_CHALLENGES_QUERY }
        ]}
      >
        {(signup, { error, loading }) => {
          if (loading) return <p>Loading...</p>;

          return (
            <FormStyled
              method="POST"
              onSubmit={async e => {
                e.preventDefault();

                await signup();

                this.setState({
                  name: "",
                  password: "",
                  email: ""
                });

                Router.push({
                  pathname: "/"
                });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign up for an account</h2>

                <Error error={error} />

                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>

                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.saveToState}
                  />
                </label>

                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Sign up</button>
              </fieldset>
            </FormStyled>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
