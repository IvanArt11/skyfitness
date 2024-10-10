import * as S from "./styles.js";
import { useEffect, useState } from "react";

export default function AuthPage({ isLoginChange = false }) {
  const [error, setError] = useState(null);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [disable] = useState(false);

  const handleLoginChange = async () => {
    if (!login) {
      setError("Заполните поле!");
      return;
    }
  };

  const handlePasswordChange = async () => {
    if (!password || !repeatPassword) {
      setError("Заполните все поля");
      return;
    }
    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }
  };

  useEffect(() => {
    setError(null);
  }, [isLoginChange, login, password, repeatPassword]);

  return (
    <S.PageContainer>
      <S.ModalForm>
        <S.ModalLogo>
          <S.ModalLogoImage src="/img/logo-dark.svg" alt="logo" />
        </S.ModalLogo>
        {isLoginChange ? (
          <>
            <S.Inputs>
              <S.ModalLabel>Новый логин:</S.ModalLabel>
              <S.ModalInput
                type="text"
                name="login"
                placeholder="Логин"
                value={login}
                onChange={(event) => {
                  setLogin(event.target.value);
                }}
              />
            </S.Inputs>
            {error && <S.Error>{error}</S.Error>}
            <S.Buttons>
              {disable ? (
                <p style={{ color: "#000" }}>Обновляем логин...</p>
              ) : (
                <S.PrimaryButton onClick={() => handleLoginChange({ login })}>
                  Сохранить
                </S.PrimaryButton>
              )}
            </S.Buttons>
          </>
        ) : (
          <>
            <S.Inputs>
              <S.ModalLabel>Новый пароль:</S.ModalLabel>
              <S.ModalInput
                type="password"
                name="password"
                placeholder="Пароль"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
              <S.ModalInput
                type="password"
                name="repeat-password"
                placeholder="Повторите пароль"
                value={repeatPassword}
                onChange={(event) => {
                  setRepeatPassword(event.target.value);
                }}
              />
            </S.Inputs>
            {error && <S.Error>{error}</S.Error>}
            <S.Buttons>
              {disable ? (
                <p style={{ color: "#000" }}>Обновляем пароль...</p>
              ) : (
                <S.PrimaryButton onClick={handlePasswordChange}>
                  Сохранить
                </S.PrimaryButton>
              )}
            </S.Buttons>
          </>
        )}
      </S.ModalForm>
    </S.PageContainer>
  );
}
