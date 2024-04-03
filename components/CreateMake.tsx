import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import client from "../lib/apolloClient";

const CREATE_MAKE_MUTATION = gql`
  mutation CreateMake($make_name: String!) {
    createMake(make_name: $make_name) {
      make_id
      make_name
    }
  }
`;

type Make = {
  make_id: number;
  make_name: string;
};

type CreateMakeResponse = {
  createMake: Make;
};

export default function CreateMake() {
  const [makeName, setMakeName] = useState("");
  const [createMake, { loading, error, data }] =
    useMutation<CreateMakeResponse>(CREATE_MAKE_MUTATION, { client });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!makeName) return;
    await createMake({ variables: { make_name: makeName } });
    setMakeName("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
    return <p>Error :(</p>;
  }

  return (
    <div>
      <div>Create Make</div>
      <form onSubmit={handleSubmit}>
        <input
          value={makeName}
          onChange={(e) => setMakeName(e.target.value)}
          placeholder="Make Name"
        />
        <button type="submit">Create Make</button>
      </form>
      {data?.createMake && (
        <div>
          <p>Created Make:</p>
          <p>ID: {data.createMake.make_id}</p>
          <p>Name: {data.createMake.make_name}</p>
        </div>
      )}
    </div>
  );
}
