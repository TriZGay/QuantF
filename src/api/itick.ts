import request from "@/utils/request";

export interface SymbolListRequest {
  type: "stock" | "forex" | "indices" | "crypto"
  region: "hk" | "sz" | "sh" | "us" | "sg" | "gb" | "ba",
  code?: string
}

export interface Product {
  code: number;
  msg: string;
  data: Array<ProductItem>;
}

export interface ProductItem {
  //产品代码
  c: string;
  //产品名称
  n: string;
  //产品类别
  t: string;
  //交易所
  e: string;
}

export function fetchProductList(req: SymbolListRequest) {
  return request.post<Product>("/itick/fetch/symbol/list", req);
}
