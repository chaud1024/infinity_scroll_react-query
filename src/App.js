// import Example1 from "./Example1";
import Example2 from "./Example2";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Example2 />
    </MantineProvider>
  );
}

export default App;
