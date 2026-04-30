import { useEffect, useState } from "react";
import PokemonBanner from "./components/PokemonBanner";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPokemons = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );

        const data = await res.json();

        const result = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );

        setPokemons(result);
      } catch (err) {
        console.log("erro ao carregar pokémons");
      }

      setLoading(false);
    };

    loadPokemons();
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
          <PokemonBanner
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => console.log(pokemon.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;