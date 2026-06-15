body {
  margin: 0;
  background: radial-gradient(circle at top, #0a1020, #05070f);
  color: #00ffe1;
  font-family: monospace;
}

.app {
  padding: 20px;
  max-width: 1100px;
  margin: auto;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.subtitle {
  opacity: 0.6;
  font-size: 12px;
}

.panel {
  border: 1px solid rgba(0,255,225,0.2);
  padding: 15px;
  margin-bottom: 15px;
  background: rgba(10,15,30,0.4);
  box-shadow: 0 0 15px rgba(0,255,225,0.05);
}

input, textarea, button {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background: rgba(5,10,20,0.8);
  border: 1px solid #00ffe1;
  color: #00ffe1;
  box-sizing: border-box;
}

textarea {
  min-height: 300px;
  white-space: pre-wrap;
}

.preview-box {
  margin-top: 10px;
  text-align: center;
}

#preview {
  max-width: 400px;
  border: 1px solid #00ffe1;
  margin-top: 10px;
}

/* LIST */
#list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
  margin-top: 10px;

  /* IMPORTANT pour alignement propre */
  align-items: stretch;
}

/* CARD */
.card {
  display: flex;
  flex-direction: column;

  height: 100%; /* 🔥 clé pour égaliser les hauteurs */
  background: rgba(10,15,30,0.4);
  border: 1px solid rgba(0,255,225,0.2);
  padding: 10px;
  box-sizing: border-box;
}

.card-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.card-actions {
  display: flex;
  gap: 5px;
  margin-top: auto;
}

.card-actions button {
  flex: 1;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 12px rgba(0,255,225,0.2);
}

.card-actions button {
  transition: all 0.15s ease;
  cursor: pointer;
}

/* effet hover global */
.card-actions button:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 8px rgba(0,255,225,0.35);
}

/* COPY (cyan) */
.card-actions button:nth-child(1):hover {
  background: rgba(0, 255, 225, 0.15);
  border-color: #00ffe1;
}

/* EDIT (bleu légèrement plus chaud) */
.card-actions button:nth-child(2):hover {
  background: rgba(80, 180, 255, 0.15);
  border-color: #50b4ff;
  box-shadow: 0 0 8px rgba(80, 180, 255, 0.4);
}

/* DELETE (rouge danger) */
.card-actions button:nth-child(3):hover {
  background: rgba(255, 60, 60, 0.15);
  border-color: #ff3c3c;
  box-shadow: 0 0 8px rgba(255, 60, 60, 0.4);
}

/* bottom bar */
.bottom-bar {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  gap: 10px;
  padding: 10px;
  background: rgba(0,0,0,0.85);
  border-top: 1px solid rgba(0,255,225,0.3);
}

.bottom-bar button {
  flex: 1;
}

#scanBtn {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* hover principal */
#scanBtn:hover {
  background: rgba(0, 255, 225, 0.12);
  box-shadow: 0 0 12px rgba(0, 255, 225, 0.5);
  transform: translateY(-1px);
  border-color: #00ffe1;
}

/* effet "pulse scanner" */
#scanBtn:hover::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(0, 255, 225, 0.25),
    transparent 60%
  );
  animation: scanPulse 1.2s infinite;
}

/* animation */
@keyframes scanPulse {
  0% {
    transform: scale(0.6);
    opacity: 0.6;
  }
  50% {
    transform: scale(1);
    opacity: 0.2;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

#saveBtn {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* hover principal */
#saveBtn:hover {
  background: rgba(0, 255, 225, 0.15);
  border-color: #00ffe1;
  box-shadow: 0 0 14px rgba(0, 255, 225, 0.45);
  transform: translateY(-1px);
}

/* effet "écriture mémoire" */
#saveBtn:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: -30%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(0, 255, 225, 0.25),
    transparent
  );
  animation: saveSweep 1s infinite;
}

/* animation */
@keyframes saveSweep {
  0% {
    left: -60%;
  }
  100% {
    left: 120%;
  }
}
