import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SmartTable from "./components/SmartTable";

const theme = createTheme({
  palette: {
    // mode: "dark",
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          ".MuiTableCell-root": {
            fontWeight: 700,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          "&.cell-empty": {
            backgroundColor: 'rgb(246,246,246)',
            // borderRight: 'solid 2px pink'
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          input: {
            fontFamily: "monospace",
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        ul: {
          justifyContent: 'center'
        },
      },
    },
  },
});

function App() {
  useEffect(() => {
    fetch("https://dummyjson.com/products/?limit=50")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const [data, setData] = useState({});

  return (
    <ThemeProvider theme={theme}>
      <Box
        className="App"
        sx={{ padding: 1, backgroundColor: "#efefef" }}
        component={Paper}
        minHeight="100vh"
      >
        <Box sx={{ width: "80%", margin: "auto" }}>
          <SmartTable data={data?.products} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
