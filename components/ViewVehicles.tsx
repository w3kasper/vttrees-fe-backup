import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_VEHICLES = gql`
  query GetVehicles {
    getVehicles {
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

const ViewAllVehicles = () => {
  const { loading, error, data } = useQuery(GET_VEHICLES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      {data.getVehicles.map((vehicle: any) => (
        <div key={vehicle.vehicle_id}>
          <p>Model ID: {vehicle.model_id}</p>
          <p>Make ID: {vehicle.make_id}</p>
          <p>User ID: {vehicle.user_id}</p>
          <p>
            {vehicle.trim} {vehicle.year}
          </p>
          <p>{vehicle.miles} miles</p>
          <p>Fuel type: {vehicle.fuel_type}</p>
          <img src={vehicle.image} alt="Vehicle" />
        </div>
      ))}
    </div>
  );
};

export default ViewAllVehicles;
