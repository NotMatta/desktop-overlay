import LeftSide from "./components/sections/left-side"

const MockBackground = () => {
  return <>
    <img src="wallpaper.jpg" className="absolute top-0 left-0 w-full h-full object-cover -z-30 blur-sm"/>
    <div className="absolute top-0 left-0 w-full h-full bg-black/60 -z-20"/>
  </>
}

const App = () => {
  return <div className="w-screen h-screen flex relative p-4">
    <MockBackground />
    <LeftSide/>
  </div>
}

export default App
