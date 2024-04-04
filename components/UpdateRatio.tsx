import { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import client from "../lib/apolloClient";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
} from "comp-library-vt-vp";

const GET_ALL_MAKES_WITH_MODELS_QUERY = gql`
  query {
    allMakesWithModels {
      make_id
      make_name
      carmodels {
        model_id
        model_name
        offset_amount
      }
    }
  }
`;

const UPDATE_MODEL_MUTATION = gql`
  mutation UpdateModel(
    $model_id: Int!
    $make_id: Int!
    $model_name: String!
    $offset_amount: Int!
  ) {
    updateModel(
      model_id: $model_id
      make_id: $make_id
      model_name: $model_name
      offset_amount: $offset_amount
    ) {
      model_id
      make_id
      model_name
      offset_amount
    }
  }
`;

type CarModel = {
  model_id: number;
  model_name: string;
  offset_amount: number;
};

type Make = {
  make_id: number;
  make_name: string;
  carmodels: CarModel[];
};

type AllMakesWithModelsResponse = {
  allMakesWithModels: Make[];
};

export default function MakesAndModels() {
  const [updateModel, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_MODEL_MUTATION, { client });

  const [inputValues, setInputValues] = useState<{ [key: number]: number }>({});
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const { loading, error, data } = useQuery<AllMakesWithModelsResponse>(
    GET_ALL_MAKES_WITH_MODELS_QUERY,
    { client }
  );

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }

  const selectedMake = data?.allMakesWithModels.find(
    (make) => make.make_id === selectedMakeId
  );

  const selectedModel = selectedMake?.carmodels.find(
    (model) => model.model_id === selectedModelId
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 4,
      }}
    >
      <Typography variant="h6" component="div" align="center">
        -Update Ratio-
      </Typography>
      <Box
        component="form"
        sx={{
          width: "50%",
          display: "flex",
          gap: 2,
          flexDirection: "column",
        }}
        noValidate
        autoComplete="off"
      >
        <Select
          value={selectedMakeId ?? ""}
          onChange={(e) => {
            setSelectedMakeId(Number(e.target.value));
            setSelectedModelId(null);
            setUpdateMessage(null);
          }}
          variant="outlined"
          fullWidth
        >
          <MenuItem value="">
            <em>Select a make</em>
          </MenuItem>
          {data?.allMakesWithModels.map(({ make_id, make_name }) => (
            <MenuItem key={make_id} value={make_id}>
              {make_name}
            </MenuItem>
          ))}
        </Select>

        {selectedMake && (
          <Select
            value={selectedModelId ?? ""}
            onChange={(e) => {
              setSelectedModelId(Number(e.target.value));
              setUpdateMessage(null);
            }}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="">
              <em>Select a model</em>
            </MenuItem>
            {selectedMake.carmodels.map(({ model_id, model_name }) => (
              <MenuItem key={model_id} value={model_id}>
                {model_name}
              </MenuItem>
            ))}
          </Select>
        )}

        {selectedModel && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="body1">{selectedModel.model_name}</Typography>
            <TextField
              type="number"
              value={
                inputValues[selectedModel.model_id] ??
                selectedModel.offset_amount
              }
              onChange={(e) => {
                setInputValues({
                  ...inputValues,
                  [selectedModel.model_id]: Number(e.target.value),
                });
              }}
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                if (
                  inputValues[selectedModel.model_id] !== undefined &&
                  selectedMake
                ) {
                  await updateModel({
                    variables: {
                      model_id: selectedModel.model_id,
                      make_id: selectedMake.make_id,
                      model_name: selectedModel.model_name,
                      offset_amount: inputValues[selectedModel.model_id],
                    },
                  });
                  setUpdateMessage(
                    `Model ${selectedModel.model_name} updated to ${
                      inputValues[selectedModel.model_id]
                    }`
                  );
                }
              }}
            >
              Update
            </Button>
            {updateMessage && (
              <Typography variant="body1">{updateMessage}</Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
