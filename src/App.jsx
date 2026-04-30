import { useEffect, useState } from "react";
import PokemonBanner from "./components/PokemonBanner";
import PokemonModal from "./components/PokemonModal";

const TYPES = [
  "fire",
  "water",
  "grass",
  "electric",
  "bug",
  "normal",
  "poison",
  "flying",
];

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [types, setTypes] = useState([]);

  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );

        const data = await res.json();

        const list = await Promise.all(
          data.results.map(async (p) => {
            const res = await fetch(p.url);
            return res.json();
          })
        );

        setPokemons(list);
      } catch (e) {
        console.log("error loading pokemons");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const toggleType = (type) => {
    setTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }

      if (prev.length >= 2) return prev;

      return [...prev, type];
    });
  };

  const filtered = pokemons.filter((p) => {
    const nameMatch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const typeMatch =
      types.length === 0 ||
      types.every((t) =>
        p.types.some((pt) => pt.type.name === t)
      );

    return nameMatch && typeMatch;
  });

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Pokédex</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="buscar Pokémon"
        style={{ padding: 8, marginBottom: 10 }}
      />

      <div style={{ marginBottom: 15 }}>
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => toggleType(t)}
            style={{
              margin: 4,
              padding: "6px 10px",
              borderRadius: 20,
              border: types.includes(t)
                ? "2px solid #000"
                : "1px solid #000",
              background: types.includes(t) ? "#ccc" : "#000",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <p>loading...</p>}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {filtered.map((p) => (
          <PokemonBanner
            key={p.id}
            pokemon={p}
            onClick={() => setSelectedPokemon(p)}
          />
        ))}
      </div>

      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </div>
  );
}

export default App;