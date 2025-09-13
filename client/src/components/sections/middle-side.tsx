import { NavBar, usePath } from "../providers/path-provider";

const MiddleSide = () => {
  const { path } = usePath()
  return <div className="grow flex flex-col items-center">
    <div className="grow">{path}</div>
    <NavBar/>
  </div>;
}

export default MiddleSide
