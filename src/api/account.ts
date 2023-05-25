import request from '@/utils/request'

export interface Account {

}

export interface AccountResult {
    records: Account[],
}

export function fetchAccounts() {
    return request.get<AccountResult>("/api/acc/accounts")
}

export function refreshAcc() {
    return request.get<String>("/api/acc/refresh")
}

export function refreshFunds() {
    return request.get<String>("/api/acc/refreshAllFunds")
}

export function fetchAccInfoByAccId(accId: string) {
    return request.get("/api/acc/info/" + accId)
}