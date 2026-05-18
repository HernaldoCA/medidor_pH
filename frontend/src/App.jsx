import { useEffect, useMemo, useState } from "react"
import "./App.css"

const STORAGE_KEY = "medidor-ph-experimentos"

const COLORS = {
  Rojo: { swatch: "#ef4444" },
  Rosa: { swatch: "#ec4899" },
  Morado: { swatch: "#7c3aed" },
  Azul: { swatch: "#2563eb" },
  Verde: { swatch: "#22c55e" },
  Amarillo: { swatch: "#eab308" },
  Naranja: { swatch: "#f97316" },
}

const INDICATORS = [
  {
    id: "col-morada",
    name: "Col morada",
    description:
      "La col morada usa antocianinas: en acidos se vuelve roja, en neutros morada y en bases azul o verde.",
    dropperColor: "#7c3aed",
    accentColor: "#c4b5fd",
    reactions: {
      acidStrong: "Rojo",
      acidWeak: "Rosa",
      neutral: "Morado",
      baseWeak: "Azul",
      baseStrong: "Verde",
    },
    scaleGradient:
      "linear-gradient(90deg, #b91c1c 0%, #ef4444 18%, #ec4899 34%, #7c3aed 50%, #2563eb 74%, #22c55e 100%)",
    scaleLegend: {
      acid: "Rojo / Rosa",
      neutral: "Morado",
      basic: "Azul / Verde",
    },
    scalePositions: {
      Rojo: 10,
      Rosa: 26,
      Morado: 50,
      Azul: 74,
      Verde: 91,
    },
  },
  {
    id: "curcuma",
    name: "Curcuma",
    description:
      "La curcuma se mantiene amarilla en acidos y neutros, pero cambia a naranja o rojo en medios basicos.",
    dropperColor: "#f59e0b",
    accentColor: "#fde68a",
    reactions: {
      acidStrong: "Amarillo",
      acidWeak: "Amarillo",
      neutral: "Amarillo",
      baseWeak: "Naranja",
      baseStrong: "Rojo",
    },
    scaleGradient:
      "linear-gradient(90deg, #fef3c7 0%, #fde68a 38%, #facc15 52%, #f59e0b 76%, #dc2626 100%)",
    scaleLegend: {
      acid: "Amarillo",
      neutral: "Amarillo",
      basic: "Naranja / Rojo",
    },
    scalePositions: {
      Amarillo: 50,
      Naranja: 77,
      Rojo: 92,
    },
  },
  {
    id: "jamaica",
    name: "Jamaica",
    description:
      "La jamaica toma rojos intensos en acidos, tonos morados en neutros y azulados o verdosos en bases.",
    dropperColor: "#ef4444",
    accentColor: "#fca5a5",
    reactions: {
      acidStrong: "Rojo",
      acidWeak: "Rosa",
      neutral: "Morado",
      baseWeak: "Azul",
      baseStrong: "Verde",
    },
    scaleGradient:
      "linear-gradient(90deg, #991b1b 0%, #ef4444 18%, #fb7185 34%, #7c3aed 52%, #2563eb 76%, #16a34a 100%)",
    scaleLegend: {
      acid: "Rojo / Rosa",
      neutral: "Morado",
      basic: "Azul / Verde",
    },
    scalePositions: {
      Rojo: 10,
      Rosa: 28,
      Morado: 52,
      Azul: 76,
      Verde: 91,
    },
  },
]

const SUGGESTED_SUBSTANCES = [
  "agua",
  "agua con sal",
  "saliva",
  "suero oral",
  "leche",
  "cafe",
  "yogurt",
  "jugo de tomate",
  "jugo de naranja",
  "jugo de limon",
  "vinagre",
  "refresco",
  "bicarbonato",
  "antiacido",
  "pasta dental",
  "jabon",
  "detergente",
  "cloro",
  "amoniaco",
]

const SUBSTANCE_PROFILES = [
  {
    ph: 7.0,
    keywords: ["agua", "agua potable", "agua destilada", "water"],
  },
  {
    ph: 7.0,
    keywords: ["agua con sal", "solucion salina"],
  },
  {
    ph: 6.8,
    keywords: ["saliva"],
  },
  {
    ph: 7.4,
    keywords: ["suero oral", "suero"],
  },
  {
    ph: 6.6,
    keywords: ["leche"],
  },
  {
    ph: 5.0,
    keywords: ["cafe"],
  },
  {
    ph: 4.4,
    keywords: ["yogurt"],
  },
  {
    ph: 4.2,
    keywords: ["jugo de tomate", "tomate", "salsa de tomate"],
  },
  {
    ph: 3.5,
    keywords: ["jugo de naranja", "naranja"],
  },
  {
    ph: 2.2,
    keywords: ["jugo de limon", "limon"],
  },
  {
    ph: 2.9,
    keywords: ["vinagre"],
  },
  {
    ph: 2.7,
    keywords: ["refresco"],
  },
  {
    ph: 2.5,
    keywords: ["coca cola", "coca"],
  },
  {
    ph: 3.3,
    keywords: ["sprite", "fanta"],
  },
  {
    ph: 3.5,
    keywords: ["jugo de manzana", "manzana"],
  },
  {
    ph: 5.5,
    keywords: ["te", "te helado"],
  },
  {
    ph: 3.5,
    keywords: ["piña", "pina"],
  },
  {
    ph: 8.3,
    keywords: ["bicarbonato", "agua con bicarbonato"],
  },
  {
    ph: 9.5,
    keywords: ["antiacido"],
  },
  {
    ph: 8.2,
    keywords: ["pasta dental"],
  },
  {
    ph: 8.5,
    keywords: ["clara de huevo", "clara"],
  },
  {
    ph: 8.8,
    keywords: ["agua jabonosa", "jabon suave"],
  },
  {
    ph: 10.5,
    keywords: ["jabon", "jabon liquido", "jabon en polvo", "lavatrastes"],
  },
  {
    ph: 10.8,
    keywords: ["detergente"],
  },
  {
    ph: 12.5,
    keywords: ["cloro", "lejia"],
  },
  {
    ph: 11.6,
    keywords: ["amoniaco"],
  },
  {
    ph: 11.0,
    keywords: ["limpiador", "desengrasante"],
  },
  {
    ph: 13.0,
    keywords: ["sosa"],
  },
  {
    ph: 13.5,
    keywords: ["destapacaños"],
  },
]

const INITIAL_FORM = {
  substance: "",
  indicatorId: INDICATORS[0].id,
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "")
  const number = Number.parseInt(clean, 16)
  const r = (number >> 16) & 255
  const g = (number >> 8) & 255
  const b = number & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function classifyByPh(ph) {
  if (ph < 7) return "acida"
  if (ph > 7) return "basica"
  return "neutra"
}

function getPhBand(ph) {
  if (ph <= 3.5) return "acidStrong"
  if (ph < 6.9) return "acidWeak"
  if (ph <= 7.4) return "neutral"
  if (ph < 10) return "baseWeak"
  return "baseStrong"
}

function getScalePositionFromPh(ph) {
  const clamped = Math.min(Math.max(ph, 0), 14)
  return 8 + (clamped / 14) * 84
}

function detectSubstance(substance) {
  const normalized = normalizeText(substance)

  if (!normalized) {
    return {
      ph: 7.0,
      classification: "neutra",
      matched: false,
      label: "muestra sin definir",
    }
  }

  const rule = SUBSTANCE_PROFILES.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  )

  if (rule) {
    return {
      ...rule,
      classification: classifyByPh(rule.ph),
      matched: true,
      label: substance.trim(),
    }
  }

  return {
    ph: 7.0,
    classification: "neutra",
    matched: false,
    label: substance.trim(),
  }
}

function buildReaction(indicator, substance) {
  const detected = detectSubstance(substance)
  const phBand = getPhBand(detected.ph)
  const colorName = indicator.reactions[phBand] || indicator.reactions.neutral
  const color = COLORS[colorName]
  const phText = detected.ph.toFixed(1)
  const matchedExplanation = detected.matched
    ? `${detected.label} tiene un pH aproximado de ${phText}.`
    : `No se encontro una coincidencia exacta para la sustancia, asi que se usa un valor neutro aproximado de pH ${phText}.`

  return {
    colorName,
    swatch: color.swatch,
    classification: detected.classification,
    phValue: detected.ph,
    explanation: `${matchedExplanation} Con ${indicator.name}, el color esperado es ${colorName.toLowerCase()}.`,
    scalePosition: getScalePositionFromPh(detected.ph),
  }
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString("es-MX")
}

function App() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [experiments, setExperiments] = useState([])
  const [status, setStatus] = useState("Listo para simular un experimento.")
  const [animationSeed, setAnimationSeed] = useState(0)

  const selectedIndicator = useMemo(
    () => INDICATORS.find((item) => item.id === form.indicatorId) || INDICATORS[0],
    [form.indicatorId]
  )

  const reaction = useMemo(
    () => buildReaction(selectedIndicator, form.substance),
    [form.substance, selectedIndicator]
  )

  const sampleName = useMemo(() => form.substance.trim() || "tu muestra", [form.substance])

  const summary = useMemo(
    () =>
      experiments.reduce(
        (acc, experiment) => {
          acc.total += 1
          if (experiment.classification === "acida") {
            acc.acida += 1
          } else if (experiment.classification === "basica") {
            acc.basica += 1
          } else {
            acc.neutra += 1
          }
          return acc
        },
        { total: 0, acida: 0, neutra: 0, basica: 0 }
      ),
    [experiments]
  )

  const stageStyle = useMemo(
    () => ({
      "--indicator-color": selectedIndicator.dropperColor,
      "--indicator-soft": hexToRgba(selectedIndicator.accentColor, 0.36),
      "--indicator-glow": hexToRgba(selectedIndicator.dropperColor, 0.28),
      "--target-color": reaction.swatch,
      "--target-soft": hexToRgba(reaction.swatch, 0.18),
      "--target-glow": hexToRgba(reaction.swatch, 0.35),
      "--paper-color": reaction.swatch,
      "--paper-glow": hexToRgba(reaction.swatch, 0.28),
      "--scale-gradient": selectedIndicator.scaleGradient,
      "--marker-left": `${reaction.scalePosition}%`,
    }),
    [reaction.scalePosition, reaction.swatch, selectedIndicator]
  )

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setExperiments(parsed)
        }
      }
    } catch (_error) {
      setStatus("No fue posible leer el historial guardado.")
    }
  }, [])

  useEffect(() => {
    setAnimationSeed((value) => value + 1)
  }, [form.substance, form.indicatorId])

  function saveExperiments(nextExperiments) {
    setExperiments(nextExperiments)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextExperiments))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const substance = form.substance.trim()
    if (!substance) {
      setStatus("Escribe una sustancia para registrar el experimento.")
      return
    }

    const nextExperiments = [
      {
        id: `exp-${Date.now()}`,
        substance,
        indicatorId: selectedIndicator.id,
        indicatorName: selectedIndicator.name,
        phValue: reaction.phValue,
        colorName: reaction.colorName,
        classification: reaction.classification,
        explanation: reaction.explanation,
        createdAt: new Date().toISOString(),
      },
      ...experiments,
    ]

    saveExperiments(nextExperiments)
    setStatus("Experimento guardado correctamente.")
  }

  function handleReset() {
    setForm(INITIAL_FORM)
    setAnimationSeed((value) => value + 1)
    setStatus("Formulario listo para un nuevo experimento.")
  }

  function handleDelete(id) {
    saveExperiments(experiments.filter((item) => item.id !== id))
    setStatus("Registro eliminado.")
  }

  function replayAnimation() {
    setAnimationSeed((value) => value + 1)
  }

  return (
    <main className="page">
      <header className="hero">
        <span className="hero-tag">Software educativo</span>
        <h1>Medidor de pH</h1>
        <p>
          Simula el uso de indicadores naturales para identificar sustancias acidas,
          neutras y basicas con una interfaz clara y visual.
        </p>
      </header>

      <section className="indicator-panel">
        <div className="section-heading">
          <h2>Indicadores naturales</h2>
          <p>Selecciona el indicador y observa como cambia la escala segun la muestra.</p>
        </div>

        <div className="indicator-grid">
          {INDICATORS.map((indicator) => (
            <article
              key={indicator.id}
              className={`indicator-card ${indicator.id === selectedIndicator.id ? "active" : ""}`}
            >
              <div
                className="indicator-dot"
                style={{ backgroundColor: indicator.dropperColor }}
                aria-hidden="true"
              />
              <div>
                <h3>{indicator.name}</h3>
                <p>{indicator.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="lab-panel">
        <div className="section-heading">
          <h2>Simulacion del experimento</h2>
          <p>La animacion ahora queda centrada dentro del cuadro y se ajusta mejor a laptop.</p>
        </div>

        <div className="lab-grid">
          <div className="form-card">
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                Sustancia
                <input
                  list="substance-suggestions"
                  value={form.substance}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, substance: event.target.value }))
                  }
                  placeholder="Ej. agua, jugo de tomate, vinagre, bicarbonato, jabon"
                />
              </label>

              <datalist id="substance-suggestions">
                {SUGGESTED_SUBSTANCES.map((substance) => (
                  <option key={substance} value={substance} />
                ))}
              </datalist>

              <label>
                Indicador
                <select
                  value={form.indicatorId}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, indicatorId: event.target.value }))
                  }
                >
                  {INDICATORS.map((indicator) => (
                    <option key={indicator.id} value={indicator.id}>
                      {indicator.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="auto-result">
                <div className="auto-result-label">Pruebas rapidas sugeridas</div>
                <div className="suggestion-list">
                  {SUGGESTED_SUBSTANCES.map((substance) => (
                    <button
                      key={substance}
                      type="button"
                      className="suggestion-chip"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          substance,
                        }))
                      }
                    >
                      {substance}
                    </button>
                  ))}
                </div>
              </div>

              <div className="auto-result">
                <div className="auto-result-label">Color calculado automaticamente</div>
                <div className="auto-result-row">
                  <span
                    className="auto-result-swatch"
                    style={{ backgroundColor: reaction.swatch }}
                    aria-hidden="true"
                  />
                  <strong>{reaction.colorName}</strong>
                </div>
              </div>

              <div className="auto-result">
                <div className="auto-result-label">pH aproximado real</div>
                <div className="auto-result-row">
                  <span className="ph-value-chip">pH {reaction.phValue.toFixed(1)}</span>
                </div>
              </div>

              <div className="auto-result">
                <div className="auto-result-label">Escala actual del indicador</div>
                <div className="scale-guide">
                  <span>
                    <strong>Acido:</strong> {selectedIndicator.scaleLegend.acid}
                  </span>
                  <span>
                    <strong>Neutro:</strong> {selectedIndicator.scaleLegend.neutral}
                  </span>
                  <span>
                    <strong>Basico:</strong> {selectedIndicator.scaleLegend.basic}
                  </span>
                </div>
              </div>

              <p className={`classification-badge ${reaction.classification}`}>
                Clasificacion: {reaction.classification} | pH {reaction.phValue.toFixed(1)}
              </p>

              <p className="explanation-box">{reaction.explanation}</p>

              <div className="action-row">
                <button type="submit" className="primary-btn">
                  Agregar experimento
                </button>
                <button type="button" className="secondary-btn" onClick={handleReset}>
                  Nuevo experimento
                </button>
              </div>
            </form>
          </div>

          <div className="simulation-card">
            <div className="simulation-header">
              <div>
                <span className="simulation-tag">Vista previa</span>
                <h3>{selectedIndicator.name} con {sampleName}</h3>
              </div>
              <button type="button" className="secondary-btn" onClick={replayAnimation}>
                Reproducir
              </button>
            </div>

            <div
              key={`${selectedIndicator.id}-${normalizeText(form.substance)}-${animationSeed}`}
              className="simulation-stage"
              style={stageStyle}
            >
              <div className="stage-glow" />

              <div className="dropper">
                <div className="dropper-cap" />
                <div className="dropper-tube" />
                <div className="dropper-tip" />
                <div className="dropper-label">{selectedIndicator.name}</div>
              </div>

              <div className="droplet droplet-one" />
              <div className="droplet droplet-two" />
              <div className="droplet droplet-three" />

              <div className="meter">
                <div className="meter-head">pH</div>
                <div className="meter-body" />
                <div className="meter-tip" />
              </div>

              <div className="test-strip">
                <div className="test-strip-head" />
                <div className="test-strip-body" />
                <div className="test-strip-pad" />
              </div>

              <div className="beaker">
                <div className="beaker-rim" />
                <div className="liquid-base" />
                <div className="liquid-target" />
                <div className="liquid-wave" />
                <div className="liquid-bubbles">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="beaker-label">{sampleName}</div>
              </div>

              <div className="scale-label-row">
                <span>{selectedIndicator.scaleLegend.acid}</span>
                <span>{selectedIndicator.scaleLegend.neutral}</span>
                <span>{selectedIndicator.scaleLegend.basic}</span>
              </div>

              <div className="ph-scale" />

              <div className="ph-marker" aria-hidden="true">
                <span className="ph-marker-label">
                  {reaction.colorName} | pH {reaction.phValue.toFixed(1)}
                </span>
                <span className="ph-marker-arrow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="history-panel">
        <div className="section-heading">
          <h2>Historial de experimentos</h2>
          <p>Los registros se guardan en localStorage para que no se pierdan al recargar.</p>
        </div>

        <div className="summary-grid">
          <article className="summary-card acid">
            <span>Acidas</span>
            <strong>{summary.acida}</strong>
          </article>
          <article className="summary-card neutral">
            <span>Neutras</span>
            <strong>{summary.neutra}</strong>
          </article>
          <article className="summary-card basic">
            <span>Basicas</span>
            <strong>{summary.basica}</strong>
          </article>
          <article className="summary-card total">
            <span>Total</span>
            <strong>{summary.total}</strong>
          </article>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sustancia</th>
                <th>Indicador</th>
                <th>pH aprox.</th>
                <th>Color</th>
                <th>Clasificacion</th>
                <th>Fecha</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {experiments.length === 0 && (
                <tr>
                  <td colSpan="7">Todavia no hay experimentos guardados.</td>
                </tr>
              )}

              {experiments.map((experiment) => (
                <tr key={experiment.id}>
                  <td>{experiment.substance}</td>
                  <td>{experiment.indicatorName}</td>
                  <td>{Number(experiment.phValue || 7).toFixed(1)}</td>
                  <td>{experiment.colorName}</td>
                  <td>
                    <span className={`table-badge ${experiment.classification}`}>
                      {experiment.classification}
                    </span>
                    <p className="table-note">{experiment.explanation}</p>
                  </td>
                  <td>{formatDate(experiment.createdAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => handleDelete(experiment.id)}
                    >
                      Eliminar registro
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="status-bar">{status}</footer>
    </main>
  )
}

export default App
