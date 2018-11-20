import Link from "next/link";

import NavStyled, { UserMessageStyled } from "./styles";

import User from "../User";
import Signout from "../Signout";

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyled>
        {me && (
          <>
            <UserMessageStyled>Hi, {me.name}</UserMessageStyled>

            <Link href="/challenge">
              <a>Challenge a friend</a>
            </Link>

            <Signout />
          </>
        )}

        {!me && (
          <>
            <Link href="/signup">
              <a>Signup</a>
            </Link>

            <Link href="/signin">
              <a>Signin</a>
            </Link>
          </>
        )}
      </NavStyled>
    )}
  </User>
);

export default Nav;
