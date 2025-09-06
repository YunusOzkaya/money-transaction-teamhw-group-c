import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeProfileModal } from "../../redux/modal/slice";
import s from "./UserModal.module.css";
import { selectUser } from "../../redux/auth/selectors";
import UserAvatar from "../UserAvatar/UserAvatar";
import useMedia from "../../hooks/UseMadia";

const UserModal = () => {
  const dispatch = useDispatch();
  const { isMobile } = useMedia();
  const { username: currentName } = useSelector(selectUser);

  // Form functionality removed - profile editing not supported by API

  const onSubmit = async (data) => {
    // Profile editing not available in GoIT Wallet API
    console.log("Profile editing not supported by API");
    dispatch(closeProfileModal());
  };

  // Avatar functionality removed

  const closeModal = () => dispatch(closeProfileModal());

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={s.overlay} onClick={handleBackdropClick}>
      <div className={s.modal}>
        <button className={s.closeBtn} onClick={closeModal}>
          <svg className={s.iconClose}>
            <use href={"/icons.svg#icon-close"}></use>
          </svg>
        </button>
        <p className={s.text}>Edit profile</p>

        <div className={s.form}>
          <div className={s.avatarLabel}>
            {isMobile ? (
              <UserAvatar
                size={96}
                borderRadius={11}
                fontSize={48}
              />
            ) : (
              <UserAvatar
                size={68}
                borderRadius={8}
                fontSize={36}
              />
            )}
          </div>

          <div className={s.labelBox}>
            <input
              value={currentName || "Username"}
              readOnly
              className={s.input}
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
            />
            <p className={s.infoText}>Profile editing not available</p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className={s.saveBtn}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
