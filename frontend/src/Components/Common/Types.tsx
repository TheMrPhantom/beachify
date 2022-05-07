export type Song = {
    databaseID?: number,
    songname: string,
    album: string,
    trackID: string,
    coverURL: string,
    interpret: string,
    duration: number,
    startsAt: number,
    is_next: boolean,
    upvotes?: number,
    downvotes?: number,
    alreadyAdded?: boolean,
    banned?: boolean,
    approvalPending?: boolean,
    insertion_time?: string
}

export type Playlist = {
    playlistname: string,
    playlistID: string,
    coverURL: string
}

export const DummySong: Song = {
    songname: "",
    album: "",
    trackID: "",
    coverURL: "",
    interpret: "",
    duration: 0,
    startsAt: 0,
    is_next: false,
}