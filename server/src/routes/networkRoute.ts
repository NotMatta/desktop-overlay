import { spawn } from 'child_process';
import { Router } from 'express';

interface WifiNetwork {
  inUse: boolean;
  ssid: string;
  bars: number;
  security: string;
}

const router = Router();

router.get('/scan', (req, res) => {
  const watchProcess = spawn("nmcli", ["-f", "SSID,BARS,SECURITY,IN-USE", "dev", "wifi"]);
  const dataChunks: Buffer[] = [];
  watchProcess.stdout.on("data", (data) => {
    console.log(`WiFi Scan Result:\n${data}`);
    dataChunks.push(data);
  });
  watchProcess.on('close', (code) => {
    const wifis : WifiNetwork[] = Buffer.concat(dataChunks).toString().split('\n').slice(1).filter(line => line.trim() !== '').map(line => {
      const [ssid, stringBars, security,inUse] = line.split(/\s+/).filter(Boolean)
      const bars = stringBars.replace("_", '').length;
      return { ssid, bars, security, inUse: inUse === '*' };
    }).sort((a,b) => b.bars - a.bars).sort((a,b) => Number(b.inUse) - Number(a.inUse));
    res.json({ message: `WiFi scan completed with code ${code}` , wifis});
  });
});

router.get("/toggle", (req, res) => {
  const { state } = req.query;
  if (state !== 'on' && state !== 'off') {
    return res.status(400).json({ error: "Invalid state. Use 'on' or 'off'." });
  }
  const nmcliProcess = spawn("nmcli", ["radio", "wifi", state as string]);
  nmcliProcess.on('close', (code) => {
    res.json({ message: `WiFi turned ${state} with code ${code}` });
  });
});

router.post("/connect", (req, res) => {
  const { ssid, password } = req.body;
  if (!ssid) {
    return res.status(400).json({ error: "SSID is required." });
  }
  const args = password ? ["dev", "wifi", "connect", ssid, "password", password] : ["dev", "wifi", "connect", ssid];
  const nmcliProcess = spawn("nmcli", args);
  const dataChunks: Buffer[] = [];
  nmcliProcess.stdout.on("data", (data) => {
    console.log(`WiFi Connect Result:\n${data}`);
    dataChunks.push(data);
  });
  nmcliProcess.on('close', (code) => {
    res.json({ message: `Connection attempt to ${ssid} completed with code ${code}`, output: Buffer.concat(dataChunks).toString() });
  });
});

router.post("/disconnect", (req, res) => {
  const { ssid } = req.body;
  if (!ssid) {
    return res.status(400).json({ error: "SSID is required." });
  }
  const nmcliProcess = spawn("nmcli", ["con", "down", ssid]);
  nmcliProcess.on('close', (code) => {
    res.json({ message: `Disconnection attempt from ${ssid} completed with code ${code}` });
  });
});

export default router;
