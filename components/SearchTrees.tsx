import { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import client from "../lib/apolloClient";
import { TextField, Button, Box, Paper, Typography } from "comp-library-vt-vp";

const SEARCH_MAKES_AND_MODELS_QUERY = gql`
  query SearchMakesAndModels($make_name: String, $model_name: String) {
    searchMakesAndModels(make_name: $make_name, model_name: $model_name) {
      make_name
      model_name
      total_trees
    }
  }
`;

type SearchResult = {
  make_name: string;
  model_name: string;
  total_trees: number;
};

type SearchMakesAndModelsResponse = {
  searchMakesAndModels: SearchResult[];
};

export default function Search() {
  const [makeName, setMakeName] = useState("");
  const [modelName, setModelName] = useState("");
  const [executeSearch, { loading, error, data }] =
    useLazyQuery<SearchMakesAndModelsResponse>(SEARCH_MAKES_AND_MODELS_QUERY, {
      client,
    });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }

  return (
    // <div>
    //   <input
    //     value={makeName}
    //     onChange={(e) => setMakeName(e.target.value)}
    //     placeholder="Search by make"
    //   />
    //   <input
    //     value={modelName}
    //     onChange={(e) => setModelName(e.target.value)}
    //     placeholder="Search by model"
    //   />
    //   <button
    //     onClick={() => {
    //       // Execute the query when the button is clicked
    //       executeSearch({
    //         variables: { make_name: makeName, model_name: modelName },
    //       });
    //     }}
    //   >
    //     Search
    //   </button>
    //   {data?.searchMakesAndModels.map(
    //     ({ make_name, model_name, total_trees }) => (
    //       <div key={`${make_name}-${model_name}`}>
    //         <div>Make: {make_name}</div>
    //         <div>Model: {model_name}</div>
    //         <div>Total trees: {total_trees}</div>
    //       </div>
    //     )
    //   )}
    // </div>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 0,
        border: 0,
        borderBottom: 1,
        borderColor: "divider",
        marginBottom: 2,
      }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          gap: 2,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          executeSearch({
            variables: { make_name: makeName, model_name: modelName },
          });
        }}
      >
        <TextField
          value={makeName}
          onChange={(e) => setMakeName(e.target.value)}
          placeholder="Search by make"
          variant="outlined"
        />
        <TextField
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="Search by model"
          variant="outlined"
        />
        <Button variant="contained" type="submit">
          Search
        </Button>
      </Box>
      {data?.searchMakesAndModels.map(
        ({ make_name, model_name, total_trees }) => (
          <Paper key={`${make_name}-${model_name}`} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">
              Make: {make_name}, Model: {model_name}
            </Typography>
            <Typography variant="body1">Total trees: {total_trees}</Typography>
          </Paper>
        )
      )}
    </Box>
  );
}
