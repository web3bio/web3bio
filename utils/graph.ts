export const enum GraphType {
    socialGraph = 0,
    identityGraph = 1,
  }
export interface ResultNeighbor {
    identity: string;
  }
export interface IdentityGraph {
    // todo: fulfill this type file
    graphId: string;
    nodes: any[];
    edges: any[];
  }