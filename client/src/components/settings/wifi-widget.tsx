import { useState } from "react";
import { Check, EthernetPort, LoaderCircle, Wifi, Search, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

interface WifiNetwork {
  inUse: boolean;
  ssid: string;
  bars: number;
  security: string;
}

const WifiNetwork = (props : {network: WifiNetwork, expanded: string, setExpanded: (s: string) => void}) => {

  const [loading,setLoading] = useState(false)

  const handleConnect = (formData: FormData) => {
    setLoading(true);
    const password = formData.get("password");
    console.log(`Connecting to ${props.network.ssid} with password ${password}`);
    try {
      fetch("http://localhost:3000/api/network/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ssid: props.network.ssid,
          password: password
        })
      }).then(res => res.json()).then(data => {
        console.log(data);
        props.setExpanded("");
      });
    } catch(e) {
      console.error("Failed to connect", e);
    }
    setLoading(false);
  }

  const handleDisconnect = () => {
    setLoading(true);
    console.log(`Disconnecting from ${props.network.ssid}`);
    try {
      fetch("http://localhost:3000/api/network/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ssid: props.network.ssid
        })
      }).then(res => res.json()).then(data => {
        console.log(data);
        props.setExpanded("");
      });
    } catch(e) {
      console.error("Failed to disconnect", e);
    }
    setLoading(false);
  }

  return <div className={`flex flex-col px-4 py-2 rounded-lg w-full ${props.expanded == props.network.ssid && "bg-accent"} ${props.network.inUse ? "bg-foreground text-background" : "hover:bg-accent"}`}>
    <div className="font-medium flex justify-between items-center select-none" onClick={() => props.setExpanded(props.expanded == props.network.ssid ? "" : props.network.ssid)}>
      <div className="flex flex-col">
        <p className="col-span-2">{props.network.ssid}</p>
        <p className="flex items-center gap-2 text-sm"><Lock size={16}/>{props.network.security}</p>
      </div>
      {props.network.inUse && <Check />}
    </div>
    {props.expanded == props.network.ssid && <div className="flex flex-col gap-2 mt-2">
      {props.network.inUse ? 
        <Button size="sm" className="self-end" onClick={handleDisconnect} disabled={loading}>Disconnect</Button>
        : 
        <form className="flex flex-col gap-2" action={handleConnect}>
          <Input name="password" type="password" placeholder="Enter Password...."/>
          <Button type="submit" size="sm" className="self-end" disabled={loading}>Connect</Button>
        </form>
      }
    </div>}
  </div>;
}

const WifiWdiget = () => {

  const [toggle,setToggle] = useState<boolean>(true)
  const [networks,setNetworks] = useState<WifiNetwork[]>([])
  const [expanded,setExpanded] = useState("")
  const [loading,setLoading] = useState(false)

  const fetchNetworks = async () => {
    try{
      setLoading(true);
      setNetworks([]);
      const res = await fetch("http://localhost:3000/api/network/scan");
      const data = await res.json();
      setNetworks(data.wifis);
    } catch(e) {
      console.error("Failed to fetch networks", e);
    };
    setLoading(false);
  }

  const toggleWifi = async (state: "on" | "off") => {
    try{
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/network/toggle?state=${state}`);
      if(!res.ok) {
        throw new Error("Failed to toggle wifi");
      } else {
        if(state === "on") {
          setTimeout(() => {
            fetchNetworks();
          }, 2000);
        } else {
          setLoading(false);
        }
      }
    } catch(e) {
      console.error("Failed to toggle wifi", e);
    };
  }

  return <div className="bg-primary-foreground/90 border p-2 px-4 rounded-lg">
    <div className="flex justify-between items-center border-b pb-2 mb-2">
      <div className="font-bold flex gap-2 items-center"><Wifi/> Wifi</div>
      <div className="flex gap-2 items-center">
        <Button size="icon" variant="outline" onClick={fetchNetworks} disabled={loading || !toggle}><Search/></Button>
        <Switch checked={toggle} onCheckedChange={(checked) => {
          setToggle(checked);
          toggleWifi(checked ? "on" : "off");
          if(!checked) setNetworks([]);
        }} disabled={loading}/>
      </div>
    </div>
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-between items-center w-full">
      </div>
      {loading && <LoaderCircle className="animate-spin repeat-infinite"/>}
      {networks.map((network) => <WifiNetwork network={network} expanded={expanded} setExpanded={setExpanded}/>)}
    </div>
  </div>;
}

export default WifiWdiget;
