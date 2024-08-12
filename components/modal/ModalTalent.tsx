import { useMemo } from "react";
import SVG from "react-inlinesvg";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import Link from "next/link";
import { TALENT_API_ENDPOINT, talentFetcher } from "../apis";
import useSWR from "swr";

type Stamp = {
  category: string;
  weight: number;
  label: string;
  icon: string;
  type: string;
};

type GroupedStamps = {
  [category: string]: Stamp[];
};

function useTalentCredentials(id: string) {
  const { data, error } = useSWR(
    TALENT_API_ENDPOINT + `passport_credentials?passport_id=${id}`,
    talentFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    data: data?.passport_credentials.reduce((pre, cur) => {
      if (!pre.some((x) => x.category === cur.category)) {
        pre.push({
          ...cur,
          items: [],
        });
      } else {
        const item = pre.find((x) => x.category === cur.category);
        item.items.push(cur);
      }
      return pre;
    }, []),
    isLoading: !error && !data,
    isError: error,
  };
}
export default function TalentModalContent({ onClose, data, profile }) {
  console.log(data, profile);
  const { data: credentials } = useTalentCredentials(data.passport_id);
  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
      </div>
      <>
        <div
          className="modal-header"
          style={{
            ["--widget-primary-color" as string]: SocialPlatformMapping(
              PlatformType.talent
            )?.color,
          }}
        >
          <div className="modal-cover talent"></div>
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(PlatformType.talent)?.icon}`}
              width={14}
              height={14}
            />
          </div>
          <span className="modal-header-title">Talent Passport</span>
        </div>
        <div className="modal-body">
          <Image
            width={80}
            height={80}
            className="avatar avatar-xl"
            alt={profile.identity}
            src={profile?.avatar}
          />
          <div
            className="d-flex mt-2 mb-2"
            style={{ alignItems: "center", lineHeight: 1.25 }}
          >
            <strong className="h4 text-bold">{profile.displayName}</strong>
          </div>
          <div className="text-gray mt-2 mb-2">{profile.identity}</div>
          <div className="mt-2 mb-2">{profile?.description}</div>
          <div className="mt-2 mb-2">
            Builder Score <strong className="text-large">{data.score}</strong>
          </div>

          {credentials?.length > 0 && (
            <>
              <div className="divider mt-4 mb-4"></div>
              <div className="panel-widget">
                <div className="panel-widget-title">
                  Talent Passport Credentials
                </div>
                <div className="panel-widget-content">
                  {credentials.map((x) => (
                    <div key={x.id} className="stamp-item">
                      <div className="stamp-item-body">
                        <div className="stamp-item-title">
                          <strong>{x.category}</strong>
                        </div>
                        <div className="stamp-item-subtitle">
                          {x.items
                            .filter((x) => x.score > 0)
                            .map((item) => (
                              <div
                                key={item.name}
                                className="stamp-label-item feed-token"
                                title={item.name}
                              >
                                <span className="feed-token-value">
                                  {item.name} : {item.value}
                                </span>
                                <span className="feed-token-meta">
                                  {item.score} scores
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <div className="btn-group btn-group-block">
            <Link
              href={
                "https://passport.talentprotocol.com/profile/" +
                data.passport_id
              }
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <SVG src={"icons/icon-open.svg"} width={20} height={20} />
              Open in TalentProtocol
            </Link>
          </div>
        </div>
      </>
    </>
  );
}
