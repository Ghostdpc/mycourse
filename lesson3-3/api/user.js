import {request} from "@/plugins/request";
export const login= (data)=>{
    return request({
        method: "POST",
        url: "/api/users/login",
        data,
      })
}

export const register= (data)=>{
    return request({
        method: "POST",
        url: "/api/users",
        data,
      })
}

export const update= (data)=>{
  console.log("12312312")
  return request({
      method: "PUT",
      url: "/api/user",
      data,
    })
}