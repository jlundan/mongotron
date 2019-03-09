
export interface Database {
    id: string;
}

export interface Connection {
    id: string;
    url: string;
    name: string;
    databases: Database[];
}

export interface DBNavigatorViewState {
    connections: Connection[];
}
