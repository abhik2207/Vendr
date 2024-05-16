export function fetchAllQueries() {
  return new Promise(async (resolve) => {
    const response = await fetch('/queries');
    const data = await response.json();
    resolve({ data });
  });
}

export function createQuery(pagination) {
  return new Promise(async (resolve) => {
    const response = await fetch('/queries', {
      method: 'POST',
      body: JSON.stringify(pagination),
      headers: { 'content-type': 'application/json' }
    });
    const data = await response.json();
    resolve({ data });
  });
}