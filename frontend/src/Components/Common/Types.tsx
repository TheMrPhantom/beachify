export type Song = {
    databaseID?: number,
    songname: string,
    album: string,
    trackID: string,
    coverURL: string,
    interpret: string,
    upvotes?: number,
    downvotes?: number,
    alreadyAdded?: boolean,
    approvalPending?: boolean
}