import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import client from "../lib/apolloClient";

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
  const [modelId, setModelId] = useState<number | null>(null);
  const [makeId, setMakeId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [trim, setTrim] = useState<string>("");
  const [year, setYear] = useState<number | null>(null);
  const [miles, setMiles] = useState<number | null>(null);
  const [image, setImage] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("");

  const [createVehicle, { loading, error, data }] =
    useMutation<CreateVehicleResponse>(CREATE_VEHICLE_MUTATION, { client });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!modelId || !makeId || !userId || !trim || !year || !miles || !fuelType)
      return;
    await createVehicle({
      variables: {
        model_id: modelId,
        make_id: makeId,
        user_id: userId,
        trim,
        year,
        miles,
        image,
        fuel_type: fuelType,
      },
    });
    setModelId;
    setMakeId;
    setUserId;
    setTrim("");
    setYear;
    setMiles;
    setImage("");
    setFuelType("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }

  return (
    <div>
      <div>Upload Vehicle</div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={modelId || ""}
            onChange={(e) => setModelId(Number(e.target.value))}
            placeholder="Model ID"
          />
        </div>
        <div>
          <input
            value={makeId || ""}
            onChange={(e) => setMakeId(Number(e.target.value))}
            placeholder="Make ID"
          />
        </div>
        <div>
          <input
            value={userId || ""}
            onChange={(e) => setUserId(Number(e.target.value))}
            placeholder="User ID"
          />
        </div>
        <div>
          <input
            value={trim}
            onChange={(e) => setTrim(e.target.value)}
            placeholder="Trim"
          />
        </div>
        <div>
          <input
            value={year || ""}
            onChange={(e) => setYear(Number(e.target.value))}
            placeholder="Year"
          />
        </div>
        <div>
          <input
            value={miles || ""}
            onChange={(e) => setMiles(Number(e.target.value))}
            placeholder="Miles"
          />
        </div>
        <div>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
          />
        </div>
        <div>
          <input
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            placeholder="Fuel Type"
          />
        </div>
        <button type="submit">Create Vehicle</button>
      </form>
      {data?.createVehicle && (
        <div>
          <div>Created Vehicle:</div>
          <div>ID: {data.createVehicle.vehicle_id}</div>
          <div>Model ID: {data.createVehicle.model_id}</div>
          <div>Make ID: {data.createVehicle.make_id}</div>
          <div>User ID: {data.createVehicle.user_id}</div>
          <div>Trim: {data.createVehicle.trim}</div>
          <div>Year: {data.createVehicle.year}</div>
          <div>Miles: {data.createVehicle.miles}</div>
          <div>Image: {data.createVehicle.image}</div>
          <div>Fuel Type: {data.createVehicle.fuel_type}</div>
        </div>
      )}
    </div>
  );
}
