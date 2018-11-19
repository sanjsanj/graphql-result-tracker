import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import FormStyled from "../Form/styles";

import Error from "../Error";
import { CURRENT_USER_QUERY } from "../User";
import { ALL_USER_CHALLENGES_QUERY } from "../../pages";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

class Signin extends Component {
  state = {
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
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY },
          { query: ALL_USER_CHALLENGES_QUERY }
        ]}
      >
        {(signin, { error, loading }) => {
          if (loading) return <p>Loading...</p>;

          return (
            <FormStyled
              method="POST"
              onSubmit={async e => {
                e.preventDefault();

                await signin();

                this.setState({
                  password: "",
                  email: ""
                });

                Router.push({
                  pathname: "/"
                });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Log in to your account</h2>

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

                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Log in</button>
              </fieldset>
            </FormStyled>
          );
        }}
      </Mutation>
    );
  }
}

export default Signin;
