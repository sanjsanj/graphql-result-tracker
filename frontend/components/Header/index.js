import Link from "next/link";

import Nav from "../Nav";

const Header = () => (
  <>
    <div className="bar">
      <Link href="/">
        <a>Result tracker</a>
      </Link>
    </div>

    <Nav />
  </>
);

export default Header;
