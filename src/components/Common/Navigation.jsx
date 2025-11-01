import React from "react";
import { NavLink } from "react-router-dom";
import "../../css/navigation.css";

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          <h1>Rick & Morty Explorer</h1>
        </NavLink>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/characters/page/1">Characters</NavLink>
          </li>
          <li>
            <NavLink to="/locations/page/1">Locations</NavLink>
          </li>
          <li>
            <NavLink to="/episodes/page/1">Episodes</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
