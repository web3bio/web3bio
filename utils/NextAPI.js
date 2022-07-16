import { client } from "../utils/apollo"
import { gql } from "@apollo/client"

export const getAvatarsByEns = (ens) => {
  console.log(ens)
  return client.query({
    query: gql`
      query {
        nft(chain: "ethereum", category: "ENS", id: ${ens}) {
          uuid
          updatedAt
          owner {
            uuid
            platform
            identity
            displayName
            neighbor(depth: 2) {
              uuid
              platform
              identity
              displayName
            }
          }
        }
      }
    `,
  });
};