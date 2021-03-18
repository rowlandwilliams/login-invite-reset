import Axios from "axios";

export const User = {
  getCurrentUser() {
    return Axios({
      method: "GET",
      withCredentials: true,
      url: "/api/user/current",
    });
  },
};
