import "./styles.css";
import { renderApp } from "./app";
import { enforceHstsMode } from "./security/hstsMode";

enforceHstsMode();
renderApp();
