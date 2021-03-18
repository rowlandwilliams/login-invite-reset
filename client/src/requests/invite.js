import Axios from "axios";

export const inviteUser = (userCredentials) => {
  return Axios({
    method: "POST",
    data: userCredentials,
    withCredentials: true,
    url: "/api/invite/invite",
  });
};
