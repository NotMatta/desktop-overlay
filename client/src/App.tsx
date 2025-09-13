import LeftSide from "./components/sections/left-side"
import MiddleSide from "./components/sections/middle-side"
import RightSide from "./components/sections/right-side"

const MockBackground = () => {
  return <>
    <img src="wallpaper.jpg" className="absolute top-0 left-0 w-full h-full object-cover -z-30 blur-sm"/>
    <div className="absolute top-0 left-0 w-full h-full bg-black/60 -z-20"/>
  </>
}

const App = () => {
  return <div className="w-screen h-screen flex relative p-4 gap-4">
    <MockBackground />
    <LeftSide/>
    <MiddleSide/>
    <RightSide/>
  </div>
}

export default App
