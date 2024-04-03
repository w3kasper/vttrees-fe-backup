import { useQuery, gql } from "@apollo/client";
import client from "../lib/apolloClient";

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
      <div>Leaderboard</div>
      <div>
        {validMakesAndModels?.map(({ make_name, model_name, total_trees }) => (
          <div key={`${make_name}-${model_name}`}>
            <div>
              {make_name} {model_name} Total Trees: {total_trees}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LeaderBoard;
