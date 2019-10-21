import faker from "faker";

export default class UserFactory {
  public static createOne = () => ({
    firstName: `${faker.random.alphaNumeric(10)}-${Math.random()}`,
    lastName: `${faker.random.alphaNumeric(10)}-${Math.random()}`,
    email: faker.internet.email(),
    password: faker.internet.password()
  });

  public static createMany = (quantity: number) =>
    Array(quantity)
      .fill(null)
      .map((_) => UserFactory.createOne());
}
