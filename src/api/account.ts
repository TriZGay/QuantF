import request from '@/utils/request'

export interface Account {

}

export interface AccountResult {
    records: Account[],
}

export function fetchAccounts() {
    return request.get<AccountResult>("/aapi/acc/accounts")
}