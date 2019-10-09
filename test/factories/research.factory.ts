import faker from "faker";

export default class ResearchFactory {
  public static createOne = () => ({
    topic: faker.random.alphaNumeric(10),
    summary: faker.random.alphaNumeric(10)
  });

  public static createMany = (quantity: number) =>
    Array(quantity)
      .fill(null)
      .map((_) => ResearchFactory.createOne());
}
