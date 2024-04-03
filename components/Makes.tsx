import { useQuery, gql } from "@apollo/client";
import client from "../lib/apolloClient";

type Make = {
  make_id: string;
  make_name: string;
};

type GetMakesResponse = {
  getMakes: Make[];
};

const GET_MAKES_QUERY = gql`
  query GetMakes {
    getMakes {
      make_id
      make_name
    }
  }
`;

export default function Makes() {
  const { loading, error, data } = useQuery<GetMakesResponse>(GET_MAKES_QUERY, {
    client,
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }

  return (
    <div>
      {data?.getMakes.map(({ make_id, make_name }) => (
        <div key={make_id}>
          <div>
            {make_id}
            {make_name}
          </div>
        </div>
      ))}
    </div>
  );
}
