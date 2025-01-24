"use unison";
import { useCallback, useState } from "react";
import "./App.css";
import { LOADER_COLOR } from "./components/constants/loader";
import Loader from "./components/Loader";
import Scanner from "./components/scanner";
import { ref, toUnisonHook } from "@unisonjs/vue";


function App() {
  const camera = ref(false);

  return (
    <>
      <label id="camera">
        <input
          type="checkbox"
          name="camera"
          checked={camera.value}
          onChange={() => (camera.value = !camera.value)}
        />
        {camera.value ? "Camera ON" : "Camera OFF"}
      </label>
      <Scanner enableCamera={camera.value} width="100%" height="100vh" />
    </>
  );
}

export default App;
