import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "../../src/components/ui/button";

describe("Button component", () => {
  it("renders children and has role button", () => {
    render(<Button>Clique</Button>);
    const btn = screen.getByRole("button", { name: /clique/i });
    expect(btn).toBeTruthy();
  });

  it("applies primary variant classes when variant='primary'", () => {
    render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByRole("button", { name: /primary/i });
    // Ensure the variant class is present in the className
    expect(btn.className).toMatch(/bg-pm-blue|pm-blue/);
  });
});

