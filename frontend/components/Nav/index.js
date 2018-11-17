import Link from "next/link";

import NavStyled from "./styles";

import User from "../User";

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyled>
        {me && <div>Hi {me.name}</div>}

        {!me && (
          <>
            <Link href="/signup">
              <a>Signup</a>
            </Link>

            <Link href="/login">
              <a>Login</a>
            </Link>
          </>
        )}
      </NavStyled>
    )}
  </User>
);

export default Nav;
