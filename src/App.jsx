import ElementTile from "./components/element-tile/ElementTile";
import NavBar from "./components/nav-bar/NavBar";
import TextCarousell from "./components/text-carousell/text-carousell";

function App() {
  return (
    <>
      <NavBar></NavBar>
      <main>
        <header>
          <h2>Hi, I'm</h2>
          <div className="name">
            <ElementTile></ElementTile>
            uhan.
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
