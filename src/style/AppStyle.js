import { createGlobalStyle } from "styled-components";

export const StyLeGlobal = createGlobalStyle`
* {
  @font-face {
    font-family: 'StratosSkyeng';
    src:
      local('StratosSkyeng'),
      local('StratosSkyeng'),
      url('../../public/fonts/StratosSkyeng.woff2') format('woff2'),
      url('../../public/fonts/StratosSkyeng.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }

  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'StratosSkyeng', sans-serif;
  background-color: #FAFAFA;
}

a,
a:visited {
  text-decoration: none;
  cursor: pointer;
  color: inherit;
  background-color: #ffffff;
}

button {
  cursor: pointer;
  background-color: transparent;
}

input {
  outline: none;
}
`;
