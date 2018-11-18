import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import FormStyled from "../Form/styles";

import Error from "../Error";
import { CURRENT_USER_QUERY } from "../User";

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

class Login extends Component {
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
        mutation={LOGIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(login, { error, loading }) => {
          if (loading) return <p>Loading...</p>;

          return (
            <FormStyled
              method="POST"
              onSubmit={async e => {
                e.preventDefault();

                await login();

                this.setState({
                  password: "",
                  email: ""
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

export default Login;
