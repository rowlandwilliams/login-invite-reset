import Axios from "axios";

export const getAllUsers = () => {
  return Axios({
    method: "GET",
    url: "/api/user/users",
  });
};
