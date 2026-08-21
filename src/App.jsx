import ElementTile from "./components/element-tile/ElementTile";
import NavBar from "./components/nav-bar/NavBar";
import TextCarousell from "./components/text-carousell/text-carousell";
import "./App.css";

function App() {
  return (
    <>
      <NavBar></NavBar>
      <main>
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
        <TextCarousell></TextCarousell>
      </main>
    </>
  )
}

export default App
