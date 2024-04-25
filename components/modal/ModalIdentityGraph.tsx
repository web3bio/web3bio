import D3IdentityGraph from "../graph/D3IdentityGraph";
import D3SocialGraph from "../graph/D3SocialGraph";

export enum GraphType {
  identityGraph = 0,
  socialGraph = 1,
}

export default function IdentityGraphModalContent(props) {
  const { type } = props;
  return type === 0 ? (
    <D3IdentityGraph {...props} />
  ) : (
    <D3SocialGraph {...props} />
  );
}
