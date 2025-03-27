import React, { useEffect } from "react";
import Hero from "./components/Hero";

function App() {
  useEffect(() => {
    import("./three/cube.js").then((module) => {
      if (module.default) module.default(); // Call default export if available
    });
  }, []);

  return (
    <div>
      <Hero />
    </div>
  );
}

export default App;
