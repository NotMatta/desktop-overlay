import { usePath } from "../providers/path-provider";
import WifiWdiget from "../settings/wifi-widget";

const RightSide = () => {
  const { path } = usePath()
  return <div className="w-1/3 max-w-[350px] h-full">
    {path == "/settings" && <WifiWdiget/>}
    </div>
}

export default RightSide;
