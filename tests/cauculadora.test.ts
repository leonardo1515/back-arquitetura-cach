class Cauculadora {
  public somar(v1: number, v2: number) {
    return v1 + v2;
  }
}

describe("Testes de uma culculadora", () => {
  test("Verifica se 1 + 1 é igual a 2", () => {
    const cauculadora = new Cauculadora();

    const result = cauculadora.somar(1, 1);

    expect(result).toBeDefined();
    expect(result).toBeGreaterThan(1);
    expect(result).toBe(2);
  });
});
// deve <retorno_esperado> se/quando <condição>
