import gql from "graphql-tag";
import { Query } from "react-apollo";
import styled from "styled-components";

import User from "../components/User";
import Error from "../components/Error";
import ChallengeTeaser from "../components/ChallengeTeaser";

const ALL_USER_CHALLENGES_QUERY = gql`
  query ALL_USER_CHALLENGES_QUERY {
    challenges {
      id
      title
      participant {
        name
      }
      user {
        name
      }
    }
  }
`;

const TeaserContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const Home = () => (
  <div>
    <User>
      {({ data: { me } }) => (
        <>
          {me && (
            <Query query={ALL_USER_CHALLENGES_QUERY}>
              {({ data, error, loading }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <Error error={error} />;

                return (
                  <TeaserContainerStyled>
                    {data.challenges.map(challenge => (
                      <ChallengeTeaser
                        key={challenge.id}
                        challenge={challenge}
                      />
                    ))}
                  </TeaserContainerStyled>
                );
              }}
            </Query>
          )}

          {!me && <p>Signup or Signin to challenge a friend</p>}
        </>
      )}
    </User>
  </div>
);

export default Home;
export { ALL_USER_CHALLENGES_QUERY };
