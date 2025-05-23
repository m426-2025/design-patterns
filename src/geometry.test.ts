import { RectangleAdapter, Square } from "./geometry";
import { Calculator } from "./geometry.third-party";
import { Rectangle } from "./geometry.third-party";

test("RectangleAdapter adapts Quadratic as a Rectangular object", () => {
  const square = new Square(3);
  const adapted = new RectangleAdapter(square);
  expect(Calculator.getArea(adapted)).toBeCloseTo(9);
  expect(Calculator.getPerimeter(adapted)).toBeCloseTo(12);
  expect(Calculator.getDiagonal(adapted)).toBeCloseTo(Math.sqrt(18));
});

describe('Calculator', () => {
  it('should calculate the width-height ratio for rectangles', () => {
    const rectangle = new Rectangle(10, 5);
    expect(Calculator.getWidthHeightRatio(rectangle)).toBe(2);
  });

  it('should return 1 for squares', () => {
    const square = new Rectangle(7, 7);
    expect(Calculator.getWidthHeightRatio(square)).toBe(1);
  });
});
