import { useState } from "react";
import * as S from "./style";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { removeUser } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { getAuth, signOut } from "firebase/auth";

export const Header = ({ isPurple = false }) => {
  const [menu, setMenu] = useState(false);
  const [exitForm, setExitForm] = useState(false);
  const { email, login, isAuth } = useAuth(); // Используем isAuth для проверки авторизации
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickPersonalMenu = () => {
    setMenu(!menu);
  };

  const handleClickExit = () => {
    setMenu(false);
    document.body.style.overflow = "hidden";
    setExitForm(true);
  };

  const handleClickProfile = () => {
    setMenu(false);
  };

  return (
    <>
      <S.Header>
        <S.HeaderLogo to={"/"}>
          <S.HeaderLogoImg src="/img/logo-dark.svg" alt="logo" />
        </S.HeaderLogo>
        {exitForm && <ExitForm setExitForm={setExitForm} />}
        {isAuth ? ( // Проверяем, авторизован ли пользователь
          <S.Personal onClick={handleClickPersonalMenu}>
            {menu && (
              <S.PersonalMenu>
                <S.Name $isPurple={isPurple}>{login ? login : email}</S.Name>
                <S.ButtonBlock>
                  <Link to={"/profile"}>
                    <S.PersonalMenuButton onClick={handleClickProfile}>
                      Мой профиль
                    </S.PersonalMenuButton>
                  </Link>
                  <S.PersonalMenuButton onClick={handleClickExit}>
                    Выйти
                  </S.PersonalMenuButton>
                </S.ButtonBlock>
              </S.PersonalMenu>
            )}
            <img src="/img/avatar.svg" alt="avatar" />
            <S.Name $isPurple={isPurple}>{login ? login : email}</S.Name>
            <img src="/img/arrow-down.svg" alt="arrow-down" />
          </S.Personal>
        ) : (
          <S.HeaderSectionButton>
            <S.HeaderButtonLink to="/login">
              <S.HeaderButtonGreen>Войти</S.HeaderButtonGreen>{" "}
              {/* Зеленая кнопка */}
            </S.HeaderButtonLink>
          </S.HeaderSectionButton>
        )}
      </S.Header>
    </>
  );
};

const ExitForm = ({ setExitForm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, login } = useAuth();
  const auth = getAuth();

  const closeWindow = () => {
    document.body.style.overflow = null;
    setExitForm(false);
  };

  const handleClickForm = (event) => {
    event.stopPropagation();
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(removeUser());
      localStorage.removeItem("user");
      localStorage.removeItem("login");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <S.BlackoutWrapper onClick={closeWindow}>
      <S.PopupLogin onClick={(event) => handleClickForm(event)}>
        <S.closeWindow src="/img/close.svg" onClick={closeWindow} />
        <S.HeaderLogo>
          <S.HeaderLogoImg src="/img/logo-dark.svg" alt="logo" />
        </S.HeaderLogo>
        <S.TextExit>
          Вы действительно хотите выйти из аккаунта: <br />
          <Link to="/profile">
            <b onClick={closeWindow}>{login ? login : email}</b>
          </Link>
          ?
        </S.TextExit>
        <S.Button onClick={logout}>Выйти</S.Button>
      </S.PopupLogin>
    </S.BlackoutWrapper>
  );
};
