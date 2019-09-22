import IServiceResult from "../../interfaces/ServiceResult";
import Store, { IStore } from "../../database/models/Store";
import { Maybe } from "../../types/Maybe";
import { IUser } from "../../database/models/User";

export default class StoreService {
  public static findManyByOwner = async (
    ownerId: string,
    page: number
  ): Promise<IServiceResult<IStore[]>> => {
    const stores: IStore[] = await Store.find({ owner: ownerId })
      .skip(page * 20)
      .limit(20);

    return { ok: true, data: stores };
  };

  public static findOneBy = async <T>(
    query: T
  ): Promise<IServiceResult<Maybe<IStore>>> => {
    const store: Maybe<IStore> = await Store.findOne(query);

    return { ok: true, data: store };
  };

  public static register = async (
    ownerId: string,
    name: string,
    email: string,
    phone: string
  ): Promise<IServiceResult<IStore>> => {
    const storeExists: Maybe<IStore> = await Store.findOne({}).or([
      { name },
      { email },
      { phone }
    ]);
    if (storeExists) {
      return { ok: false };
    }

    const payload = {
      name,
      email,
      phone,
      owner: ownerId
    };

    const store: IStore = await Store.create(payload);

    return { ok: true, data: store };
  };

  public static updateOne = async (
    ownerId: string,
    payload: IUser
  ): Promise<IServiceResult<Maybe<IStore>>> => {
    const store: Maybe<IStore> = await Store.findOneAndUpdate(
      { owner: ownerId },
      payload,
      {
        new: true
      }
    );

    return { ok: true, data: store };
  };

  public static deleteOne = async (
    ownerId: string,
    storeId: string
  ): Promise<IServiceResult<{}>> => {
    const store: Maybe<IStore> = await Store.findOne({ _id: storeId });

    if (!store || (store.owner as any)._id != ownerId) {
      return { ok: false };
    }

    /**
     * TODO: Delete clients/schedules
     */
    await Store.findOneAndDelete({ _id: storeId });
    return { ok: true };
  };
}
