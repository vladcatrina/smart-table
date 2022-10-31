import { useEffect, useState } from "react";
import parseExpression from "../utils/parseExpression";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import TableContainer from "@mui/material/TableContainer";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import * as _ from "lodash";

const EmptyCell = (props) => {
  const { onSetEquation, cellEquation, item } = props;
  const [editing, setEditing] = useState(false);
  return (
    <Stack direction="row">
      <Stack justifyContent="center">
        {editing ? (
          <Box
            contentEditable
            variant="standard"
            fullWidth
            onBlur={(e) => onSetEquation(e.target.innerHTML)}
            // value={cellEquation}
            sx={{ fontFamily: "monospace", outline: "none" }}
          >
            {cellEquation || "EDIT"}
          </Box>
        ) : (
          cellEquation && parseExpression(cellEquation)(item).toString()
        )}
      </Stack>

      <IconButton onClick={() => setEditing(!editing)}>
        {editing ? (
          <DoneOutlineIcon fontSize="small" />
        ) : (
          <EditIcon fontSize="small" />
        )}
      </IconButton>
    </Stack>
  );
};

const SmartTable = (props) => {
  const { data = [] } = props;

  const [fields, setFields] = useState([
    "id",
    "title",
    "price",
    "rating",
    "stock",
    "discountPercentage",
    "finalPrice",
  ]);
  const [filter, setFilter] = useState("");
  const [cellEquations, setCellEquations] = useState({
    finalPrice: "price-price*discountPercentage/100",
  });
  const [tableData, setTableData] = useState([]);

  //CHANGE
  const PER_PAGE = 10;
  const [page, setPage] = useState(1);

  const handleFieldsChange = _.debounce(async (e) => {
    const { value } = e.target;
    const newArr = value.replace(/ /, "").split(",");
    setFields(newArr);
  }, 200);

  const handleFilterChange = _.debounce((e) => {
    const { value } = e.target;
    setFilter(value);
  }, 200);

  const passesFilter = (item) => {
    //OPTIMIZEEE
    let eqAdditions = {};
    for (let eq in cellEquations) {
      eqAdditions[eq] = parseExpression(cellEquations[eq])(item);
    }

    console.log({
      ...item,
      ...eqAdditions,
    });

    return parseExpression(filter)({
      ...item,
      ...eqAdditions,
    });
  };

  const handleSetEquation = (field) => (value) => {
    setCellEquations((obj) => {
      const newObj = { ...obj };
      newObj[field] = value;
      return newObj;
    });
  };

  useEffect(() => {
    console.log(data);
    setTableData(data
      .filter((item) => passesFilter(item)));
  }, [data, filter, fields]);

  useEffect(() => {
    if (page > Math.floor(tableData.length / PER_PAGE)) {
      setPage(1);
    }
  }, [tableData])

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Stack direction="column" spacing={2} padding={2}>
        <TextField
          variant="standard"
          fullWidth
          onChange={handleFieldsChange}
          defaultValue={fields.join(",")}
          label="Fields"
        />
        <TextField
          variant="standard"
          fullWidth
          onChange={handleFilterChange}
          defaultValue={filter}
          label="Filter"
        />
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            {fields.map((field) => (
              <TableCell>{field}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tableData.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((item) => (
              <TableRow>
                {fields.map((field) => (
                  <TableCell className={!item[field] && "cell-empty"}>
                    {item[field]}

                    {!item[field] && (
                      <EmptyCell
                        cellEquation={cellEquations[field]}
                        onSetEquation={handleSetEquation(field)}
                        item={item}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Pagination
        count={Math.floor(tableData.length / PER_PAGE) + 1}
        variant="outlined"
        sx={{ margin: 2 }}
        alignSelf="center"
        page={page}
        onChange={(e, n) => setPage(n)}
      />
    </TableContainer>
  );
};

export default SmartTable;
