import { useEffect, useState } from "react";

const TABS = [
  { key: "info", label: "Info" },
  { key: "stats", label: "Status" },
  { key: "evolutions", label: "Evoluções" },
];

function EvolutionNode({ node }) {
  return (
    <div style={{ textAlign: "center" }}>
      <img src={node.sprite} alt={node.name} />
      <p style={{ textTransform: "capitalize" }}>
        {node.name}
      </p>

      {node.children.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 10,
            flexWrap: "wrap",
          }}
        >
          {node.children.map((child) => (
            <EvolutionNode key={child.name} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PokemonModal({ pokemon, onClose }) {
  const [tab, setTab] = useState("info");
  const [description, setDescription] = useState("");
  const [evolutionTree, setEvolutionTree] = useState(null);
  const [loadingExtra, setLoadingExtra] = useState(false);

  useEffect(() => {
    if (!pokemon) return;

    const buildEvolutionTree = (node) => {
      return {
        name: node.species.name,
        children: node.evolves_to.map(buildEvolutionTree),
      };
    };

    const fetchSprites = async (node) => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${node.name}`
      );
      const data = await res.json();

      return {
        ...node,
        sprite: data.sprites.front_default,
        children: await Promise.all(
          node.children.map(fetchSprites)
        ),
      };
    };

    const fetchExtraData = async () => {
      setLoadingExtra(true);

      try {
        // species (descrição + evolution chain)
        const speciesRes = await fetch(pokemon.species.url);
        const speciesData = await speciesRes.json();

        // descrição (pt -> en fallback)
        const entry =
          speciesData.flavor_text_entries.find(
            (e) => e.language.name === "pt"
          ) ||
          speciesData.flavor_text_entries.find(
            (e) => e.language.name === "en"
          );

        setDescription(
          entry?.flavor_text.replace(/\f/g, " ") || ""
        );

        // evolution chain (árvore completa)
        const evoRes = await fetch(
          speciesData.evolution_chain.url
        );
        const evoData = await evoRes.json();

        const tree = buildEvolutionTree(evoData.chain);
        const treeWithSprites = await fetchSprites(tree);

        setEvolutionTree(treeWithSprites);
      } catch (err) {
        console.log("erro ao buscar dados");
      } finally {
        setLoadingExtra(false);
      }
    };

    fetchExtraData();
  }, [pokemon]);

  if (!pokemon) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 400,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h2 style={{ textAlign: "center", textTransform: "capitalize" }}>
          {pokemon.name}
        </h2>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                margin: 4,
                padding: "6px 10px",
                borderBottom:
                  tab === t.key ? "2px solid #000" : "1px solid #ccc",
                background: "transparent",
                cursor: "pointer",
                color: "#000",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loadingExtra && <p>carregando...</p>}

        {/* INFO */}
        {tab === "info" && !loadingExtra && (
          <div style={{ textAlign: "center" }}>
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
            />
            <p style={{ marginTop: 10 }}>{description}</p>
            <p>Altura: {pokemon.height}</p>
            <p>Peso: {pokemon.weight}</p>
          </div>
        )}

        {/* STATS */}
        {tab === "stats" && (
          <div>
            {pokemon.stats.map((s) => (
              <div key={s.stat.name} style={{ marginBottom: 6 }}>
                <strong style={{ textTransform: "capitalize" }}>
                  {s.stat.name}
                </strong>
                : {s.base_stat}
              </div>
            ))}
          </div>
        )}

        {/* EVOLUÇÕES (ÁRVORE COMPLETA) */}
        {tab === "evolutions" && !loadingExtra && evolutionTree && (
          <div style={{ marginTop: 10 }}>
            <EvolutionNode node={evolutionTree} />
          </div>
        )}

        <button onClick={onClose} style={{ marginTop: 15 }}>
          Fechar
        </button>
      </div>
    </div>
  );
}