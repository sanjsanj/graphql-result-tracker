import Link from "next/link";

import Nav from "../Nav";

const Header = () => (
  <>
    <div className="bar">
      <Link href="/">
        <a>
          <h1>Result tracker</h1>
        </a>
      </Link>
    </div>

    <Nav />
  </>
);

export default Header;
