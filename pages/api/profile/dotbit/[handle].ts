import type { NextApiRequest, NextApiResponse } from "next";
import {
  firstParam,
  getSocialMediaLink,
  resolveHandle,
  resolveMediaURL,
} from "../../../../utils/utils";
import _ from "lodash";
import {
  HandleNotFoundResponseData,
  HandleResponseData,
} from "../../../../utils/api";
import { createInstance } from "dotbit";
import { BitPluginAvatar } from "@dotbit/plugin-avatar";
import { PlatformType, platfomData } from "../../../../utils/platform";

const resolveNameFromDotbit = async (
  handle: string,
  res: NextApiResponse<HandleResponseData | HandleNotFoundResponseData>
) => {
  try {
    const dotbit = createInstance();
    dotbit.installPlugin(new BitPluginAvatar());
    const baseInfo = await dotbit.accountInfo(handle);
    const avatar =
      (await dotbit.records(handle, "profile.avatar"))[0]?.value ||
      (await dotbit.avatar(handle))?.url;
    const records = await dotbit.records(handle);
    const addresses = await dotbit.addresses(handle);
    let LINKRES = {};
    let CRYPTORES = {};
    if (records && records.length > 0) {
      const getLink = async () => {
        const _linkRes = {};
        records.map((x) => {
          if (
            x.type === "profile" &&
            !["avatar", "description", "email"].includes(x.subtype)
          ) {
            const key =
              _.find(platfomData, (o) => o.dotbitText?.includes(x.key))?.key ||
              x.key;

            const resolvedHandle = resolveHandle(x.value);
            _linkRes[key] = {
              link:
                key === PlatformType.website
                  ? x.value
                  : getSocialMediaLink(resolvedHandle, key),
              handle: resolvedHandle,
            };
          }
        });
        return _linkRes;
      };
      LINKRES = await getLink();
    }

    if (addresses && addresses.length) {
      CRYPTORES = addresses.reduce((pre, cur) => {
        const key = cur.key.replaceAll("address.", "");
        if (!pre[key]) {
          pre[key] = cur.value;
        }
        return pre;
      }, {});
    }

    const resJSON = {
      owner: baseInfo.owner_key || baseInfo.manager_key,
      identity: baseInfo.account || baseInfo.account_alias,
      displayName: baseInfo.account || baseInfo.account_alias || handle,
      avatar: resolveMediaURL(avatar),
      email: await dotbit.records(handle, "profile.email")[0]?.value,
      description: await dotbit.records(handle, "profile.description")[0]
        ?.value,
      location: null,
      header: null,
      links: LINKRES,
      addresses: CRYPTORES,
    };
    res
      .status(200)
      .setHeader(
        "Cache-Control",
        `public, s-maxage=${60 * 60 * 24 * 7}, stale-while-revalidate=${
          60 * 30
        }`
      )
      .json(resJSON);
  } catch (error) {
    res.status(500).json({
      identity: handle,
      error: error.code === 20006 ? "No results" : error.message,
    });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HandleResponseData>
) {
  const inputName = firstParam(req.query.handle);
  return resolveNameFromDotbit(inputName, res);
}
