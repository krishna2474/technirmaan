import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header
      className={`flex w-full px-10 items-center justify-center text-white`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-center">
          <div className="w-60 max-w-full px-4">
            <div className="block w-full py-5">
              <Link to={"/"}>
                <img src={"/Logo.png"} alt="logo" className="" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
