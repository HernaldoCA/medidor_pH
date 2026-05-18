const API = '/api'

export async function isBackendAvailable() {
  try {
    const response = await fetch(`${API}/health`)
    return response.ok
  } catch {
    return false
  }
}

export async function fetchExperiments() {
  const response = await fetch(`${API}/experiments`)
  if (!response.ok) {
    throw new Error('No se pudieron cargar los experimentos.')
  }
  return response.json()
}

export async function createExperiment(experiment) {
  const response = await fetch(`${API}/experiments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(experiment),
  })

  if (!response.ok) {
    throw new Error('No se pudo guardar el experimento.')
  }

  return response.json()
}

export async function deleteExperiment(id) {
  const response = await fetch(`${API}/experiments/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('No se pudo eliminar el experimento.')
  }
}
