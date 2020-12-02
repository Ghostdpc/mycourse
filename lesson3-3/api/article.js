import {request} from "@/plugins/request";
export const getArticles= (params)=>{
    return request({
        method: "GET",
        url: "/api/articles",
        params,
      })
}

export const getFeedAricles= (params)=>{
    return request({
        method: "GET",
        url: "/api/articles/feed",
        params,
      })
}

export const addFavorite= (slug)=>{
    return request({
        method: "POST",
        url: `/api/articles/${slug}/favorite`,
      })
}

export const deleteFavorite= (slug)=>{
    return request({
        method: "DELETE",
        url: `/api/articles/${slug}/favorite`,
      })
}


export const getArticle= (slug)=>{
  return request({
      method: "GET",
      url: `/api/articles/${slug}`,
    })
}

export const getComments= (slug)=>{
  return request({
      method: "GET",
      url: `/api/articles/${slug}/comments`,
    })
}

export const createArticle = (param)=>{
  return request({
    method:"POST",
    url: `/api/articles`,
    data:param
  })
}

// export const updateArticle = (param)=>{
//   return request({
//     method:"PUT",
//     url: `/api/articles`,
//     data:param
//   })
// }