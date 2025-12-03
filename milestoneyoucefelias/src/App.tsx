import NavBar from "./components/ui/NavBar";
import Banner from "./components/ui/Banner";
import Teachers from "./components/ui/Teachers";
import Department from "./components/ui/Department";
import GradualBlur from "./GradualBlur";
import FloatingLines from "./components/FloatingLines";

function App() {
  return (
    <>
      <main className="w-full m-0 p-0">
        <div className="flex flex-col pt-20 min-h-screen w-full relative">
          {/* background floating lines */}
          <div style={{ position: 'absolute', inset: 0, background: 'black', zIndex: 0 }}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <FloatingLines
                enabledWaves={["top", "middle", "bottom"]}
                lineCount={[5, 5, 20]}
                lineDistance={[8, 15, 4]}
                bendRadius={5.0}
                bendStrength={-0.5}
                interactive={true}
                parallax={true}
              />
            </div>
          </div>

        
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />

          <div className="relative z-20">
            <NavBar />
            <Banner />
          </div>
        </div>

        <Department />
        <Teachers />
        
        
      </main>

      <GradualBlur
        target="page"
        position="bottom"
        height="10rem"
        strength={1.5}
        divCount={7}
        curve="bezier"
        exponential={true}
        opacity={1}
      />
    </>
  );
}

export default App;
