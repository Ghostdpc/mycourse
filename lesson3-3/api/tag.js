import {request} from "@/plugins/request";
export const getTags= ()=>{
    return request({
        method: "GET",
        url: "/api/tags"
      })
}

// export const register= (data)=>{
//     return request({
//         method: "POST",
//         url: "/api/users",
//         data,
//       })
// }