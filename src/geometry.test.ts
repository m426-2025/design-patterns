import { RectangleAdapter, Square } from "./geometry";
import { Calculator } from "./geometry.third-party";

test("RectangleAdapter adapts Quadratic as a Rectangular object", () => {
  const square = new Square(3);
  const adapted = new RectangleAdapter(square);
  expect(Calculator.getArea(adapted)).toBeCloseTo(9);
  expect(Calculator.getPerimeter(adapted)).toBeCloseTo(12);
  expect(Calculator.getDiagonal(adapted)).toBeCloseTo(Math.sqrt(18));
  expect(Calculator.getWidthHeightRatio(adapted)).toBe(1);
});
