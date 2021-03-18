import Axios from "axios";

// check token passed in header
export const checkRegister = (token) => {
  return Axios({
    method: "GET",
    url: `/api/invite/secret-register/${token}`,
  });
};
