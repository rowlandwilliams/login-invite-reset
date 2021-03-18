import Axios from "axios";

export const Session = {
  create(userCredentials) {
    return Axios({
      method: "POST",
      data: userCredentials,
      withCredentials: true,
      url: "/api/auth/login",
    });
  },
  delete() {
    return Axios({
      method: "GET",
      withCredentials: true,
      url: "/api/auth/logout",
    });
  },
};
