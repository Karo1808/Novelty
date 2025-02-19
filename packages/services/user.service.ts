import type {
  SelectUserInfo,
} from "@novelty/db/schemas/user-profile.schema";
import { HttpStatusCodes } from "@novelty/lib/http-status-codes";
import type { HttpStatusCodeValue } from "@novelty/lib/http-status-codes";
import type { MarkKeysAsPartial } from "@novelty/lib/types";
import type { ServiceDependencies, ServiceResponse } from "./types";
import {
  getProfileByUserIdQuery,
} from "@novelty/db/queries/user.query";

export const getProfile = async <TStatusCodes extends HttpStatusCodeValue>(
  dependencies: MarkKeysAsPartial<
    ServiceDependencies,
    ["redisClient", "messageQueueInstance"]
  >,
  userId: string,
): Promise<
  ServiceResponse<TStatusCodes> & { body?: SelectUserInfo["profile"] }
> => {
  const userProfile = await getProfileByUserIdQuery(dependencies, userId);

  if (!userProfile) {
    return { status: HttpStatusCodes.NOT_FOUND as TStatusCodes };
  }

  return {
    status: HttpStatusCodes.OK as TStatusCodes,
    body: userProfile,
  };
};
