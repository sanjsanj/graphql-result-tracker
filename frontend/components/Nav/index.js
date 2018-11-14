import Link from "next/link";

import NavStyled from "./styles";

const Nav = () => (
  <NavStyled>
    <Link href="/signup">
      <a>Signup</a>
    </Link>
    
    <Link href="/login">
      <a>Login</a>
    </Link>
  </NavStyled>
);

export default Nav;
