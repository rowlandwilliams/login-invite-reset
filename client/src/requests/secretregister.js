import Axios from "axios";

export const createSecretUser = (userCredentials, token) => {
  return Axios({
    method: "POST",
    data: userCredentials,
    withCredentials: true,
    url: `/api/invite/create-secret-register/${token}`,
  });
};
