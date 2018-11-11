import Link from "next/link";

import NavStyled from "./styles";

const Nav = () => (
  <NavStyled>
    <Link href="/">
      <a>Home!</a>
    </Link>
  </NavStyled>
);

export default Nav;
