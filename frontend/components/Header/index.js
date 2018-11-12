import NProgress from "nprogress";
import Router from "next/router";
import Link from "next/link";

import { LogoStyled } from "./styles";

import Nav from "../Nav";

Router.onRouteChangeStart = () => {
  NProgress.start();
}
Router.onRouteChangeComplete = () => {
  NProgress.done();
}
Router.onRouteChangeError = () => {
  NProgress.done();
}

const Header = () => (
  <>
    <LogoStyled>
      <Link href="/">
        <a>
          <h1>Result Tracker</h1>
        </a>
      </Link>
    </LogoStyled>

    <Nav />
  </>
);

export default Header;
