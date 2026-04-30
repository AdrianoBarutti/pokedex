import { useEffect, useState } from "react";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchPokemons = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );

        const data = await response.json();

        const result = await Promise.all(
          data.results.map((p) =>
            fetch(p.url).then((res) => res.json())
          )
        );

        if (active) {
          setPokemons(result);
        }
      } catch (err) {
        console.log("error fetching pokemons");
      }

      setLoading(false);
    };

    fetchPokemons();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>Pokédex</h1>

      {loading && <p>Carregando...</p>}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            style={{
              width: 120,
              margin: 10,
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 10,
              background: "#fff",
            }}
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
            />

            <p style={{ textTransform: "capitalize" }}>
              {pokemon.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;