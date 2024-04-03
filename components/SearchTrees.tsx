import { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import client from "../lib/apolloClient";

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
    <div>
      <input
        value={makeName}
        onChange={(e) => setMakeName(e.target.value)}
        placeholder="Search by make"
      />
      <input
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
        placeholder="Search by model"
      />
      <button
        onClick={() => {
          // Execute the query when the button is clicked
          executeSearch({
            variables: { make_name: makeName, model_name: modelName },
          });
        }}
      >
        Search
      </button>
      {data?.searchMakesAndModels.map(
        ({ make_name, model_name, total_trees }) => (
          <div key={`${make_name}-${model_name}`}>
            <div>Make: {make_name}</div>
            <div>Model: {model_name}</div>
            <div>Total trees: {total_trees}</div>
          </div>
        )
      )}
    </div>
  );
}
