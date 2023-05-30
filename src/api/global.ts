import request from '@/utils/request'

export function connect2FT() {
    return request.get<string>("/api/global/connect")
}

export function disconnect2FT() {
    return request.get<string>("/api/global/disconnect")
}