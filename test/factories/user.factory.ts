import faker from "faker";

export default class UserFactory {
  public static createOne = () => ({
    email: faker.internet.email(),
    password: faker.internet.password()
  });

  public static createMany = (quantity: number) =>
    Array(quantity)
      .fill(null)
      .map((_) => ({
        email: faker.internet.email(),
        password: faker.internet.password()
      }));
}
