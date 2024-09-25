import { ModalType } from "../hooks/useModal";

export default function WidgetEFP(props) {
  const { pageTitle, openModal, profile, avatar } = props;

  return (
    <div className="profile-actions">
      <div className="btn-group">
        <button
          className={`profile-follow btn btn-lg btn-primary`}
          title={`Follow ${pageTitle}`}
          onClick={() => {
            openModal(ModalType.efp, {
              profile: {
                ...profile,
                avatar,
              },
            });
          }}
        >
          <span className="btn-emoji mr-1">😃</span>
          Follow
        </button>
      </div>
    </div>
  );
}
