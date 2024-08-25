import { useMemo } from "react";
import SVG from "react-inlinesvg";
import Image from "next/image";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import Link from "next/link";
import { TALENT_API_ENDPOINT, TalentFetcher } from "../utils/api";
import useSWR from "swr";

function useTalentCredentials(id: string) {
  const { data, error } = useSWR(
    TALENT_API_ENDPOINT + `passport_credentials?passport_id=${id}`,
    TalentFetcher,
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
          items: [cur],
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

export default function TalentModalContent({ onClose, data }) {
  const profile = data.passport_profile;
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
            ).color,
          }}
        >
          <div className="modal-cover talent"></div>
          <div className="platform-icon">
            <SVG
              src={`../${SocialPlatformMapping(PlatformType.talent).icon}`}
              fill="#fff"
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
            alt={profile.name}
            src={profile.image_url}
          />
          <div
            className="d-flex mt-2"
            style={{ alignItems: "center", lineHeight: 1.25 }}
          >
            <strong className="h4 text-bold">{profile.display_name}</strong>
          </div>
          <div className="text-gray mt-1 mb-2">
            Talent Passport ID #{data.passport_id}
          </div>
          <div className="mt-2 mb-2">{profile?.bio}</div>
          <div className="mt-4 mb-2">
            <div className="feed-token">
              <span className="text-large">🛠️</span>
              <span className="feed-token-value">Builder Score</span>
              <span className="feed-token-value text-bold">{data.score}</span>
            </div>
          </div>

          {credentials?.length > 0 && (
            <>
              <div className="divider mt-4 mb-4"></div>
              <div className="panel-section">
                <div className="panel-section-title">
                  Talent Passport Credentials
                </div>
                <div className="panel-section-content">
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
                                key={item.id}
                                className="stamp-label-item feed-token"
                                title={item.name}
                              >
                                <span className="feed-token-value">
                                  {item.name}
                                </span>
                                <span className="feed-token-meta">
                                  {item.value}
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
              Open in Talent Protocol
            </Link>
          </div>
        </div>
      </>
    </>
  );
}
