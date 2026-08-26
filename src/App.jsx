import ElementTile from "./components/element-tile/ElementTile";
import NavBar from "./components/nav-bar/NavBar";
import "./App.css";
import ThreeMolecule from "./components/three-molecule/ThreeMolecule";

function App() {
  return (
    <>
      <NavBar></NavBar>
      <main>
        <div id="background">
          <ThreeMolecule />
        </div>
        <div id="content">
          <header>
            <h2>Hi, I'm</h2>
            <div className="name">
              <ElementTile></ElementTile>
              <h1>uhan.</h1>
            </div>
          </header>
          <p className="subtitle">
            "We are made of star stuff" - Carl Sagan
          </p>
        </div>
      </main>
    </>
  )
}

export default App
