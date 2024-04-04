import { useQuery, gql } from "@apollo/client";
import client from "../lib/apolloClient";
import Image from "next/image";
import { TextField, Button, Box, Paper, Typography } from "comp-library-vt-vp";

type MakeAndModel = {
  make_name: string;
  model_name: string;
  total_trees: number | null;
};

type GetAllMakesAndModelsResponse = {
  getAllMakesAndModels: MakeAndModel[];
};

const GET_ALL_MAKES_AND_MODELS_QUERY = gql`
  query GetAllMakesAndModels {
    getAllMakesAndModels {
      make_name
      model_name
      total_trees
    }
  }
`;

const LeaderBoard = () => {
  const { loading, error, data } = useQuery<GetAllMakesAndModelsResponse>(
    GET_ALL_MAKES_AND_MODELS_QUERY,
    { client }
  );

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }

  const validMakesAndModels = data?.getAllMakesAndModels.filter(
    ({ total_trees }) => total_trees && total_trees > 0
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 3,
          marginBottom: 3,
        }}
      >
        <Image src="/carlogo.svg" alt="Icon" width={50} height={50} />
        <Typography variant="h4" component="div" align="center">
          &nbsp;- Leader Board -&nbsp;
        </Typography>
        <Image
          src="/carlogo.svg"
          alt="Icon"
          width={50}
          height={50}
          style={{ transform: "scaleX(-1)" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 2,
        }}
      >
        {validMakesAndModels
          ?.sort((a, b) => (b.total_trees ?? 0) - (a.total_trees ?? 0))
          .map(({ make_name, model_name, total_trees }) => (
            <Paper
              key={`${make_name}-${model_name}`}
              elevation={3}
              sx={{
                p: 2,
                width: "50%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Image src="/car2.svg" alt="Car" width={30} height={30} />
                <Typography variant="h6">
                  {make_name} {model_name}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1">
                  Total Trees: {total_trees}
                </Typography>
                <Image src="/forest2.svg" alt="Forest" width={30} height={30} />
              </Box>
            </Paper>
          ))}
      </Box>
    </>
  );
};

export default LeaderBoard;
