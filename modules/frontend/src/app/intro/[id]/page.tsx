import React from 'react';

async function getData(id: string): Promise<string> {
  const baseUrl = process.env.BASE_API;
  const url = `${baseUrl}/${id}`;

  console.log('Making request to: ', url);

  const response = await fetch(url).then((resp) => {
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(resp.statusText);
  });
  return response.name;
}

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const name = await getData(params.id);
    return <div>My name is {name}</div>;
  } catch (error: any) {
    return <div>{error?.message}</div>;
  }
}
