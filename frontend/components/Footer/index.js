import { getYear } from "date-fns";

const Footer = () => <footer>© {getYear(Date.now())}</footer>;

export default Footer;
