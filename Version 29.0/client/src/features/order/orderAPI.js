export function createOrder(order) {
  return new Promise(async (resolve) => {
    const response = await fetch('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
      headers: { 'content-type': 'application/json' }
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchAllOrders(sort, pagination) {
  let queryString = '';

  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  console.log({queryString});

  return new Promise(async (resolve) => {
    const response = await fetch('/orders?' + queryString);
    const dataJSON = await response.json();

    // -- My code -- 
    // const allOrders = await fetch('/orders');
    // const allOrdersJSON = await allOrders.json();
    // const totalOrders = allOrdersJSON.length;

    // -- Coder dost code -- 
    const totalOrders = await response.headers.get('X-Total-Count');

    resolve({ data: { orders: dataJSON, totalOrders: +totalOrders } });
  });
}

export function updateOrder(update) {
  return new Promise(async (resolve) => {
    const response = await fetch('/orders/' + update.id, {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers: { 'content-type': 'application/json' }
    });
    const data = await response.json();
    resolve({ data });
  });
}