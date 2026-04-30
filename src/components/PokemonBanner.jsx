export default function PokemonBanner({ pokemon, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 120,
        margin: 10,
        padding: 12,
        borderRadius: 12,
        border: "1px solid #e5e5e5",
        background: "#fff",
        cursor: "pointer",
        textAlign: "center",
        transition: "transform 0.15s ease",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "scale(1.05)")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.transform = "scale(1)")
      }
    >
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        style={{ width: 80, height: 80 }}
      />

      <p style={{ textTransform: "capitalize", marginTop: 8 }}>
        {pokemon.name}
      </p>
    </div>
  );
}