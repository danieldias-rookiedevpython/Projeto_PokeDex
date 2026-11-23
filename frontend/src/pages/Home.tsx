import { Link } from "react-router-dom";
import { menuItems } from "../config/menu";

export function Home() {
  return (
    <section>
      <h1>PokéDex</h1>
      <p>Escolha uma área para começar.</p>
      <div className="home-cards">
        {menuItems.map((item) => (
          <Link key={item.to} to={item.to} className="home-card">
            <h2>{item.label}</h2>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}