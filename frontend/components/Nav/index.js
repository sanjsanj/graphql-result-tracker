import Link from "next/link";

import NavStyled from "./styles";

import User from "../User";
import Signout from "../Signout";

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyled>
        {me && (
          <>
            <div>Hi, {me.name}</div>

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
