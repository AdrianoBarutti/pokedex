export default function PokemonModal({ pokemon, onClose }) {
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
          width: 320,
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          textAlign: "center",
        }}
      >
        <h2 style={{ textTransform: "capitalize" }}>
          {pokemon.name}
        </h2>

        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
        />

        <p>Altura: {pokemon.height}</p>
        <p>Peso: {pokemon.weight}</p>

        <button onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}