import React, { ReactNode, useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import client from "@/lib/apolloClient";
import { Box, Button, TextField, Typography } from "comp-library-vt-vp";

import { useAppSelector } from "../lib/redux/hooks";

// import { useAppDispatch } from "../lib/redux/hooks";
// import { refreshLeaderboard } from "../lib/redux/leaderboardSlice";

const GET_VEHICLES_BY_USER_ID = gql`
  query GetVehiclesByUserId($userId: Int!) {
    vehiclesByUserId(user_id: $userId) {
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

const GET_MODEL_BY_ID = gql`
  query GetModelById($modelId: Int!) {
    getModel(model_id: $modelId) {
      model_id
      model_name
    }
  }
`;

const GET_MAKE_BY_ID = gql`
  query GetMakeById($makeId: Int!) {
    getMake(make_id: $makeId) {
      make_id
      make_name
    }
  }
`;

const CREATE_PURCHASE = gql`
  mutation CreatePurchase(
    $userId: Int!
    $vehicleId: Int!
    $numberOfTrees: Int!
  ) {
    createPurchase(
      user_id: $userId
      vehicle_id: $vehicleId
      number_of_trees: $numberOfTrees
    ) {
      purchase_id
      user_id
      vehicle_id
      number_of_trees
    }
  }
`;

const PurchaseTrees = () => {
  const userId = useAppSelector((state) => state.auth.userId);

  const { loading, error, data } = useQuery(GET_VEHICLES_BY_USER_ID, {
    variables: { userId: userId },
  });

  const [createPurchase] = useMutation(CREATE_PURCHASE);

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (data) {
      const fetchModelsAndMakes = async () => {
        const vehiclesWithModelsAndMakes = await Promise.all(
          data.vehiclesByUserId.map(
            async (vehicle: { model_id: any; make_id: any }) => {
              const { data: modelData } = await client.query({
                query: GET_MODEL_BY_ID,
                variables: { modelId: vehicle.model_id },
              });

              const { data: makeData } = await client.query({
                query: GET_MAKE_BY_ID,
                variables: { makeId: vehicle.make_id },
              });

              return {
                ...vehicle,
                model_name: modelData.getModel.model_name,
                make_name: makeData.getMake.make_name,
              };
            }
          )
        );

        setVehicles(vehiclesWithModelsAndMakes as never[]);
      };

      fetchModelsAndMakes();
    }
  }, [data]);

  //PURCHAE TREES
  const [successNote, setSuccessNote] = useState<string | null>(null); //
  const handlePurchase = async (vehicleId: number, numberOfTrees: number) => {
    try {
      const { data } = await createPurchase({
        variables: { userId, vehicleId, numberOfTrees },
      });
      console.log(data);
      setSuccessNote(
        `Successfully purchased ${numberOfTrees} trees for vehicle ${vehicleId}` //
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "50%", // Add this line
          margin: "0 auto",
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: 4 }}>
          -My Vehicles-
        </Typography>
        {successNote && <Typography variant="body1">{successNote}</Typography>}
        {(
          vehicles as {
            model_name: ReactNode;
            make_name: ReactNode;
            vehicle_id: string;
            year: ReactNode;
            miles: ReactNode;
          }[]
        ).map((vehicle) => (
          <Box
            key={vehicle.vehicle_id}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="body1">
              {vehicle.year} - {vehicle.make_name} - {vehicle.model_name} -{" "}
              {vehicle.miles}KM
            </Typography>
            <TextField
              type="number"
              id={`input-${vehicle.vehicle_id}`}
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={() =>
                handlePurchase(
                  Number(vehicle.vehicle_id),
                  Number(
                    (
                      document.getElementById(
                        `input-${vehicle.vehicle_id}`
                      ) as HTMLInputElement
                    ).value
                  )
                )
              }
            >
              Buy Trees
            </Button>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default PurchaseTrees;
