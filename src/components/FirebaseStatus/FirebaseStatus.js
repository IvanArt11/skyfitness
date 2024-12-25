import PropTypes from "prop-types";
import * as S from "./style";

export const FirebaseStatus = ({ status }) => {
  if (status.isChecking) {
    return <div>Checking Firebase services...</div>;
  }

  if (!status.isWorking) {
    return (
      <S.StatusContainer hasError>
        <S.StatusTitle hasError>Firebase Services Error</S.StatusTitle>
        <p>Some services are not working properly.</p>
        {status.error && <S.ErrorMessage>Error: {status.error}</S.ErrorMessage>}
        {status.details && (
          <div>
            <p>Service Status:</p>
            <S.StatusList>
              <S.StatusItem>
                Auth: {status.details.auth ? "✅" : "❌"}
              </S.StatusItem>
              <S.StatusItem>
                Firestore: {status.details.firestore ? "✅" : "❌"}
              </S.StatusItem>
              <S.StatusItem>
                Storage: {status.details.storage ? "✅" : "❌"}
              </S.StatusItem>
            </S.StatusList>
          </div>
        )}
      </S.StatusContainer>
    );
  }

  return null;
};

//Добавление PropTypes для типизации
FirebaseStatus.propTypes = {
  status: PropTypes.shape({
    isChecking: PropTypes.bool.isRequired,
    isWorking: PropTypes.bool.isRequired,
    error: PropTypes.string,
    details: PropTypes.shape({
      auth: PropTypes.bool,
      firestore: PropTypes.bool,
      storage: PropTypes.bool,
    }),
  }).isRequired,
};
