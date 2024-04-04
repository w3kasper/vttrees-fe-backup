import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
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

const GET_MAKES_QUERY = gql`
  query GetMakes {
    getMakes {
      make_id
      make_name
    }
  }
`;

const CREATE_MODEL_MUTATION = gql`
  mutation CreateModel(
    $make_id: Int!
    $model_name: String!
    $offset_amount: Int!
  ) {
    createModel(
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

type Make = {
  make_id: number;
  make_name: string;
};

type GetMakesResponse = {
  getMakes: Make[];
};

type Model = {
  make_id: number;
  model_name: string;
  offset_amount: number;
};

type CreateModelResponse = {
  createModel: Model;
};

export default function CreateModel() {
  const [selectedMakeId, setSelectedMakeId] = useState("");
  const [modelName, setModelName] = useState("");
  const [offsetAmount, setOffsetAmount] = useState("");
  const {
    loading: queryLoading,
    error: queryError,
    data,
  } = useQuery<GetMakesResponse>(GET_MAKES_QUERY, { client });

  const [
    createModel,
    { loading: mutationLoading, error: mutationError, data: createModelData },
  ] = useMutation<CreateModelResponse>(CREATE_MODEL_MUTATION, { client });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedMakeId || !modelName || !offsetAmount) return;

    const variables = {
      make_id: Number(selectedMakeId),
      model_name: modelName,
      offset_amount: Number(offsetAmount),
    };

    console.log("Submitting with variables:", variables);

    await createModel({ variables });
    setModelName("");
    setOffsetAmount("");
  };

  if (queryLoading || mutationLoading) return <p>Loading...</p>;
  if (queryError || mutationError) {
    console.error(queryError || mutationError);
    return <p>Error :(</p>;
  }

  return (
    // <div>
    //   <div>Create Model</div>
    //   <form onSubmit={handleSubmit}>
    //     <select
    //       value={selectedMakeId}
    //       onChange={(e) => setSelectedMakeId(e.target.value)}
    //     >
    //       <option value="">Select a make</option>
    //       {data?.getMakes.map(({ make_id, make_name }) => (
    //         <option key={make_id} value={make_id}>
    //           {make_name}
    //         </option>
    //       ))}
    //     </select>
    //     <input
    //       value={modelName}
    //       onChange={(e) => setModelName(e.target.value)}
    //       placeholder="Model Name"
    //     />
    //     <input
    //       value={offsetAmount}
    //       onChange={(e) => setOffsetAmount(e.target.value)}
    //       placeholder="Offset Amount"
    //       type="number"
    //     />
    //     <button type="submit">Create Model</button>
    //   </form>
    //   {createModelData?.createModel && (
    //     <div>
    //       <p>Created Model:</p>
    //       <p>Make ID: {createModelData.createModel.make_id}</p>
    //       <p>Name: {createModelData.createModel.model_name}</p>
    //       <p>Offset Amount: {createModelData.createModel.offset_amount}</p>
    //     </div>
    //   )}
    // </div>
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
        -Create Model-
      </Typography>
      <Box
        component="form"
        sx={{
          width: "50%",
          display: "flex",
          gap: 2,
          flexDirection: "column",
        }}
        onSubmit={handleSubmit}
      >
        <Select
          value={selectedMakeId}
          onChange={(e) => setSelectedMakeId(e.target.value)}
          variant="outlined"
          fullWidth
        >
          <MenuItem value="">
            <em>Select a make</em>
          </MenuItem>
          {data?.getMakes.map(({ make_id, make_name }) => (
            <MenuItem key={make_id} value={make_id}>
              {make_name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="Model Name"
          variant="outlined"
          fullWidth
        />
        <TextField
          value={offsetAmount}
          onChange={(e) => setOffsetAmount(e.target.value)}
          placeholder="Offset Amount"
          type="number"
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" type="submit" color="primary">
          Create Model
        </Button>
      </Box>
      {createModelData?.createModel && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            width: "50%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h6">Created Model:</Typography>
          <Typography variant="body1">
            Make ID: {createModelData.createModel.make_id}
          </Typography>
          <Typography variant="body1">
            Name: {createModelData.createModel.model_name}
          </Typography>
          <Typography variant="body1">
            Offset Amount: {createModelData.createModel.offset_amount}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
