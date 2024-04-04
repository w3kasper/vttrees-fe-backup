import { useState } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import client from "../lib/apolloClient";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "comp-library-vt-vp";

const GET_ALL_MAKES_WITH_MODELS_QUERY = gql`
  query GetAllMakesWithModels {
    allMakesWithModels {
      make_id
      make_name
      carmodels {
        model_id
        model_name
      }
    }
  }
`;

const CREATE_VEHICLE_MUTATION = gql`
  mutation CreateVehicle(
    $model_id: Int!
    $make_id: Int!
    $user_id: Int!
    $trim: String!
    $year: Int!
    $miles: Int!
    $image: String
    $fuel_type: String!
  ) {
    createVehicle(
      model_id: $model_id
      make_id: $make_id
      user_id: $user_id
      trim: $trim
      year: $year
      miles: $miles
      image: $image
      fuel_type: $fuel_type
    ) {
      vehicle_id
      model_id
      make_id
      user_id
      trim
      year
      miles
      image
      fuel_type
    }
  }
`;

type Vehicle = {
  vehicle_id: number;
  model_id: number;
  make_id: number;
  user_id: number;
  trim: string;
  year: number;
  miles: number;
  image: string;
  fuel_type: string;
};

type CreateVehicleResponse = {
  createVehicle: Vehicle;
};

export default function UploadVehicle() {
  const { loading, error, data } = useQuery(GET_ALL_MAKES_WITH_MODELS_QUERY);
  const [
    createVehicle,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation<CreateVehicleResponse>(CREATE_VEHICLE_MUTATION);

  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  const userId = useSelector((state: RootState) => state.auth.userId);
  const [trim, setTrim] = useState<string>("");
  const [year, setYear] = useState<number | null>(null);
  const [miles, setMiles] = useState<number | null>(null);
  const [image, setImage] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !selectedModelId ||
      !selectedMakeId ||
      !userId ||
      !trim ||
      !year ||
      !miles ||
      !fuelType
    )
      return;
    await createVehicle({
      variables: {
        model_id: selectedModelId,
        make_id: selectedMakeId,
        user_id: userId, //direct from store
        trim,
        year,
        miles,
        image,
        fuel_type: fuelType,
      },
    });
    setSelectedModelId(null);
    setSelectedMakeId(null);
    // setUserId;
    setTrim("");
    setYear(null);
    setMiles(null);
    setImage("");
    setFuelType("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }

  const selectedMake = data?.allMakesWithModels.find(
    (make: { make_id: number | null }) => make.make_id === selectedMakeId
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
        Upload Vehicle
      </Typography>
      <Box
        component="form"
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column", // Add this line
          gap: 2,
          margin: "0 auto", // Add this line
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          select
          value={selectedMakeId || ""}
          onChange={(e) => {
            setSelectedMakeId(Number(e.target.value));
            setSelectedModelId(null);
          }}
          placeholder="Select a make"
          variant="outlined"
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data?.allMakesWithModels.map(
            ({
              make_id,
              make_name,
            }: {
              make_id: number;
              make_name: string;
            }) => (
              <MenuItem key={make_id} value={make_id}>
                {make_name}
              </MenuItem>
            )
          )}
        </TextField>
        {selectedMake && (
          <TextField
            select
            value={selectedModelId || ""}
            onChange={(e) => setSelectedModelId(Number(e.target.value))}
            placeholder="Select a model"
            variant="outlined"
            fullWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {selectedMake.carmodels.map(
              ({
                model_id,
                model_name,
              }: {
                model_id: number;
                model_name: string;
              }) => (
                <MenuItem key={model_id} value={model_id}>
                  {model_name}
                </MenuItem>
              )
            )}
          </TextField>
        )}
        {selectedModelId && (
          <>
            <TextField
              value={trim}
              onChange={(e) => setTrim(e.target.value)}
              placeholder="Trim"
              variant="outlined"
              fullWidth
            />
            <TextField
              value={year || ""}
              onChange={(e) => setYear(Number(e.target.value))}
              placeholder="Year"
              variant="outlined"
              fullWidth
            />
            <TextField
              value={miles || ""}
              onChange={(e) => setMiles(Number(e.target.value))}
              placeholder="Miles"
              variant="outlined"
              fullWidth
            />
            <TextField
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL"
              variant="outlined"
              fullWidth
            />
            <TextField
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              placeholder="Fuel Type"
              variant="outlined"
              fullWidth
            />
          </>
        )}
        <Button
          variant="contained"
          type="submit"
          sx={{ backgroundColor: "#4c7043" }}
        >
          Create Vehicle
        </Button>
      </Box>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error :(</p>}
      {mutationData?.createVehicle && (
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
          <Typography variant="h6">Created Vehicle:</Typography>
          <Typography variant="body1">
            ID: {mutationData.createVehicle.vehicle_id}
          </Typography>
          <Typography variant="body1">
            Model ID: {mutationData.createVehicle.model_id}
          </Typography>
          <Typography variant="body1">
            Make ID: {mutationData.createVehicle.make_id}
          </Typography>
          <Typography variant="body1">
            User ID: {mutationData.createVehicle.user_id}
          </Typography>
          <Typography variant="body1">
            Trim: {mutationData.createVehicle.trim}
          </Typography>
          <Typography variant="body1">
            Year: {mutationData.createVehicle.year}
          </Typography>
          <Typography variant="body1">
            Miles: {mutationData.createVehicle.miles}
          </Typography>
          <Typography variant="body1">
            Image: {mutationData.createVehicle.image}
          </Typography>
          <Typography variant="body1">
            Fuel Type: {mutationData.createVehicle.fuel_type}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
