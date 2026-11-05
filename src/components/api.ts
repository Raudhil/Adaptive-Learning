export async function api<T=any>(path:string,method="GET",data?:unknown):Promise<T> {
 const response=await fetch(`/api/${path}`,{method,headers:{"Content-Type":"application/json","X-CSRF-Protection":"1"},body:data===undefined?undefined:JSON.stringify(data),cache:"no-store"});
 const result=await response.json();
 if (!response.ok) throw new Error(result.error||"Permintaan gagal.");
 return result;
}
