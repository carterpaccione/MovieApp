declare namespace Express {
    interface Request {
      user?: {
        username: string;
        email: string;
        _id: string;
      };
    }
}