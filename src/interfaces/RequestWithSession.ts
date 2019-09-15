import { Request } from "express";

type RequestWithSession = Request & {
  session?: any;
};

export default RequestWithSession;
