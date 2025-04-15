export interface RoomRequest {
  latitude: {
    gte: any;
    lte: any;
  };
  longitude: {
    gte: any;
    lte: any;
  };
  platform: string;
}
