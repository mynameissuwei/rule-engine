import request from "@/utils/request";

export const fetchAccount = () => {
  return request({
    url: "/session/current",
    method: "get",
  });
};
