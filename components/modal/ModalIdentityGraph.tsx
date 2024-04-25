"use client";
import { useEffect, useState } from "react";
import D3IdentityGraph from "../graph/D3IdentityGraph";
import D3SocialGraph from "../graph/D3SocialGraph";
import { useLazyQuery } from "@apollo/client";
import { GET_SOCIAL_GRAPH } from "../utils/queries";
import { Loading } from "../shared/Loading";
import { GraphType, resolveSocialGraphData } from "../graph/utils";

export default function IdentityGraphModalContent(props) {
  const { type, domain, platform } = props;

  const [querySocial, { loading, data: socialGraph }] = useLazyQuery(
    GET_SOCIAL_GRAPH,
    {
      variables: {
        platform: platform,
        identity: domain.endsWith(".farcaster")
          ? domain.replace(".farcaster", "")
          : domain,
      },
    }
  );
  useEffect(() => {
    if (type === GraphType.socialGraph) {
      querySocial();
    }
  }, [type]);
  return type === 0 ? (
    <D3IdentityGraph {...props} />
  ) : loading ? (
    <Loading />
  ) : (
    <D3SocialGraph data={socialGraph} {...props} />
  );
}
