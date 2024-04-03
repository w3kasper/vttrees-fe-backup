import { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import client from "../lib/apolloClient";

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
    <div>
      <div>Update Ratio</div>
      <select
        value={selectedMakeId ?? ""}
        onChange={(e) => {
          setSelectedMakeId(Number(e.target.value));
          setSelectedModelId(null);
          setUpdateMessage(null);
        }}
      >
        <option value="">Select a make</option>
        {data?.allMakesWithModels.map(({ make_id, make_name }) => (
          <option key={make_id} value={make_id}>
            {make_name}
          </option>
        ))}
      </select>

      {selectedMake && (
        <select
          value={selectedModelId ?? ""}
          onChange={(e) => {
            setSelectedModelId(Number(e.target.value));
            setUpdateMessage(null);
          }}
        >
          <option value="">Select a model</option>
          {selectedMake.carmodels.map(({ model_id, model_name }) => (
            <option key={model_id} value={model_id}>
              {model_name}
            </option>
          ))}
        </select>
      )}

      {selectedModel && (
        <div>
          <span>{selectedModel.model_name}</span>
          <input
            type="number"
            value={
              inputValues[selectedModel.model_id] ?? selectedModel.offset_amount
            }
            onChange={(e) => {
              setInputValues({
                ...inputValues,
                [selectedModel.model_id]: Number(e.target.value),
              });
            }}
          />
          <button
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
          </button>
          {updateMessage && <div>{updateMessage}</div>}
        </div>
      )}
    </div>
  );
}
