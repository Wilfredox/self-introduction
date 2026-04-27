declare global {
  namespace Express {
    interface Request {
      adminSession?: {
        sessionId: string;
        adminUserId: string;
        username: string;
      };
    }
  }
}

export {};
